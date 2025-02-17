import Stripe from "stripe"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import Recruiter from "../Models/recruitermodel.js";
import User from "../Models/userSchema.js";
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = {}

paymentController.createCheckoutSession = async (req, res) => {
    try {
      console.log("hi")
      const { plan } = req.body; 
      console.log(plan)
      const userId = req.currentUser.userId; // User from auth middleware
  
      const email = await User.findById(userId)
      const priceIds = {
        basic: "price_1Qt6VCLEhZhvpkNsDYIjpzy1", // Replace with Stripe Price ID
        silver: "price_1Qt6VzLEhZhvpkNsEVHluJlI",
        gold:"price_1Qt6WWLEhZhvpkNsaTx7frgx"
      };
  
      if (!priceIds[plan]) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }
  
     const customer = await stripe.customers.create({
        email:email.email,
        metadata: { plan }, // Attach metadata to customer
      });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer: customer.id, // Use customer instead of customer_email
        line_items: [
          {
            price: priceIds[plan],
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        subscription_data: {
            metadata: { // Ensure metadata is attached at the subscription level
              userId: userId.toString(), 
              plan: plan  
            }
          }
      });

      const transporter = nodemailer.createTransport({
        service:"Gmail",
        auth:{
          user:process.env.EMAIL,
          pass:process.env.APP_PASSWORD
        }
      })
      
      const mailOptions = {
        from:process.env.EMAIL,
        to:email.email,
        subject:"Subscription Confirmation",
        text:`Hello ${email.name},\n\nYour subscrption to ${plan} is successful!  🎉\n\nThank you for subscribing.\n\nBest,\nYour Team`,
      }

      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log("Error sending email:", error);
          
        }
        else{
          console.log("Email send:", info.response);
          
        }
      })
  
      res.json({ sessionUrl: session.url ,plan });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Error creating checkout session" });
    }
  };

paymentController.webhooks = async (req, res) => {
    console.log("running");
    const sig = req.headers["stripe-signature"];

    if (!sig) {
        console.error("❌ No stripe-signature header found");
        return res.status(400).json({ error: "No stripe-signature header found" });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body, // MUST be raw body, not JSON parsed
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

  
if (event.type === "invoice.payment_succeeded") {
            console.log("✅ Payment successful! Processing subscription...");
        
            const session = event.data.object;
        
            const stripeSubscriptionId = session.subscription;
        
            if (!stripeSubscriptionId) {
                console.error("❌ Subscription ID missing in invoice!");
                return res.status(400).json({ error: "Subscription ID missing" });
            }
        
            // Fetch the subscription to get metadata
            const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
            const userId = subscription.metadata?.userId;
            const plan = subscription.metadata?.plan || "not found";

console.log("🔍 Retrieved subscription:", JSON.stringify(subscription, null, 2));
console.log("👤 User ID:", userId);
console.log("📜 Plan:", plan);

        
            if (!userId) {
                console.error("❌ User ID not found in subscription metadata");
                return res.status(400).json({ error: "User ID missing in subscription" });
            }
        
            const user = await Recruiter.findOne({userId})
                user.subscriptionPlan = plan;
                user.stripe.status = "active";
                user.stripe.stripeCustomerId = session.customer;
                user.stripe.stripeSubscriptionId = stripeSubscriptionId;
                user.isSubscribed = true
                await user.save();
        
                console.log(`✅ Admin ${userId} upgraded to ${plan} plan`);
        
            res.json({ received: true });
        }
        
        if (event.type === "customer.subscription.deleted") {
            console.log("⚠️ Subscription canceled! Downgrading user to free plan...");

            const subscription = event.data.object;
            const userId = subscription.metadata?.userId;

            if (!userId) {
                console.error("❌ User ID missing in subscription metadata");
                return res.status(400).json({ error: "User ID missing in subscription" });
            }

            const user = await Recruiter.findOne({userId});
            console.log("📝 Retrieved user:", user);

            if (user) {
                user.subscriptionPlan = "free"; 
                user.stripe.status = "canceled";
                user.isSubscribed = false
                await user.save();

                console.log(`🔻 User ${userId} downgraded to Free plan`);
            }

            return res.json({ received: true });
        }

    } catch (err) {
        console.error("🚨 Webhook Error:", err.message);
        res.status(400).json({ error: `Webhook error: ${err.message}` });
    }
};

// paymentController.fetchSubscriptionStatus = async (req, res) => {
//         try {
//             const user = await User.findOne({role:"admin"});

//             if (!user) {
//                 return res.status(404).json({ message: "User not found" });
//             }

//             res.json({
//                 plan: user.subscription.plan || "free",
//                 status: user.subscription.status || "inactive",
//             });
//         } catch (error) {
//             console.error("Error fetching subscription status:", error);
//             res.status(500).json({ message: "Failed to fetch subscription status" });
//         }
//     }

export default paymentController    