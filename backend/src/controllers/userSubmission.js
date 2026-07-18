const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode=async(req,res)=>{

    try{
      const userId=req.result._id;
      const problemId=req.params.id;

      const {language,code} = req.body;

      if(!userId||!code||!problemId||!language)
      return res.status(400).send("Some field missing");

      //fetch the problem from database
      if(language==='cpp')
        language='c++';
      const problem=await Problem.findById(problemId)
       //    testcases(Hidden)

       //Kya apne submission store kar du pehle....
       const submittedResult=await Submission.create({
        userId,
        problemId,
        code,
        language,
        status:'pending',
        testCasesTotal:problem.hiddenTestCases.length
       })  
       //Judge0 code ko submit karna h
       const languageId=getLanguageById(language);
       const submission=problem.hiddenTestCases.map((testcase)=>({
        source_code:code,
        language_id:languageId,
          stdin: testcase.input,
        expected_output: testcase.output
       }));
       const submitResult=await submitBatch(submission);

       const resultToken=submitResult.map((value)=>value.token);

       const testResult=await submitToken(resultToken);

       //now update submitted result in database

       let testCasesPassed=0;
       let runtime=0;
       let memory=0;
       let status='accepted';
       let errorMessage=null;

       for(const test of testResult){
        if(test.status.id==3)
        {
           testCasesPassed++;
           runtime=runtime+parseFloat(test.time)
           memory=Math.max(memory,test.memory)
        }
        else{
            if(test.status.id==4){
                status='error'
                errorMessage=test.stderr;
            }
            else
            {
                status='wrong'
                errorMessage=test.stderr
            }
        }
       }
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory; 

    await submittedResult.save();

    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
    // req.result == user Information

     
    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

      const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });   
   
    }
    catch(err)
    {
        res.status(500).send("Internal Server Error "+ err);
    }
}

const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      const {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
   //    testcases(Hidden)


   //    Judge0 code ko submit karna hai

   const languageId = getLanguageById(language);
   console.log(languageId)
   const submissions = problem.visibleTestCases.map((testcase)=>({
       source_code:code,
       language_id: languageId,
       stdin: testcase.input,
       expected_output: testcase.output
   }));


   const submitResult = await submitBatch(submissions);
   console.log(submitResult)
   const resultToken = submitResult.map((value)=> value.token);
    console.log('hello world')
   const testResult = await submitToken(resultToken);
  // console.log("Status:", result.status?.id, result.status?.description);
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status.id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status.id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }
    
    res.status(201).json({
        success:status,
        testCases: testResult,
        runtime,
        memory
    });
      
   }
   catch(err){
     res.status(500).send("Internal Server Error "+ err);
   }
}

module.exports={submitCode,runCode};
