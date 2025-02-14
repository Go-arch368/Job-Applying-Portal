const fruits =["apple","orange","mango"]
console.log(...fruits)//unpacking 
let vegetables = ["carrot","brinjal"]
console.log(fruits.push(...vegetables))

let name ="gowtham"
console.log(...name)

let data =  [
    { _id: 1, degree: "High School", year: 2010 },
    { _id: 2, degree: "Bachelor's", year: 2015 }
]

let dataValue =  { _id: 2, degree: "Bachelor's", year: 2020}



const dataFetching = data.map((ele)=>ele._id==dataValue._id?{...ele,...dataValue}:ele)
console.log(dataFetching);

const arr = [1,2,3,4]
const arr1 = [8,9]
console.log([...arr, ...arr1])  //[1,2,3,4, [,8,9]]

const datamapping=[
{
  
    jobtitle: 'python developer',
    companyname: 'Cognizant private limited',
    description: 'our company is looking for an python developer .',
   
    noofOpenings: 2,
    assignedQuestions: [],
    jobtype: 'fulltime',
    skillsrequired: [ 'python', 'dhanjo' ],
    location: 'Bangalore',
    experienceRequired: '3',
    salary: '700k',
   
    deadline: '2025-02-23',
    clicks: 0,
    __v: 0
  },
  {
   
    jobtitle: 'php developer',
    companyname: 'Cognizant private limited',
    description: 'our company is looking of an php deveop',
  
    noofOpenings: 2,
    assignedQuestions: [],
    jobtype: 'fulltime',
    skillsrequired: [ 'php', 'laravel' ],
    location: 'Delhi',
    experienceRequired: '1',
    salary: '500k-600k',
    deadline: '2025-03-09',
    clicks: 0,
    __v: 0
  }
]

const value = datamapping.map((ele)=>ele.jobtitle)
console.log(value)