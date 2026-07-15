const BASE_URL = "https://ce.judge0.com";
const getLanguageById=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }
    return language[lang.toLowerCase()];
}


async function submitBatch(submission) {
    const response = await fetch(
        `${BASE_URL}/submissions/batch?base64_encoded=false`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                submissions:submission
            })
        }
    );

    return await response.json();
}

const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

const submitToken = async (tokens) => {

    const fetchData = async () => {
        try {
            const response = await fetch(
                //this join converts the token from array to string comma saperated
                `${BASE_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`
            );

            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    while (true) {

        const result = await fetchData();
        console.log(result.submissions)
         const isResultObtained = result.submissions?.every(
            (r) => r.status.id > 2
        );

        if (isResultObtained)
            return result.submissions;

        await waiting(1000);
    }
};
module.exports={getLanguageById,submitBatch,submitToken};

