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



