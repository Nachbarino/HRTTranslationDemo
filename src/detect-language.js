const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
//const parameter = require('../config/ai-params.json');

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: "KUWXJUx939l_0sMokzdpLJzuFU1GhAWhvwtPR_Ac91oD",
  }),
  url: "https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/8b712768-1cb8-43c5-b5d3-0583f3f777a9",
});

/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {
      
      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below

      
      languageTranslator.identify(params.text)
        .then(identifiedLanguages => {

          let identifiedLanguageByDetector="";
          let bestConfidence=0.0;
          for(let i =0;i<identifiedLanguages.result.languages.length;i++){
              if(identifiedLanguages.result.languages[i].confidence>bestConfidence){
                identifiedLanguageByDetector= identifiedLanguages.result.languages[i].language;
                bestConfidence=identifiedLanguages.result.languages[i].confidence;
              }
          }
          resolve({
            statusCode: 200,
            body: {
              text: params.text, 
              language:identifiedLanguageByDetector,
              confidence: bestConfidence,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => {
          resolve(getTheErrorResponse('Error while communicating with the language service', identifiedLanguageByDetector));
        });

      


    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}