const dbConfig = require("./dbConfig");


//const lgConfig = require("../logger/loggerDbConfig");
const logger = require("./logger");

var applicationkey = process.env.APPLICATION_KEY


class DeleteMeDb
{

    async executeQuery(query,supportKey)
    {
        try{

            return new Promise((resolve,reject)=>{

                dbConfig.getConnection(function(error, connection) {
                    if (error) {
                       console.log("11");
                       resolve("ERROR")
                    }
                    console.log(query);
        
                    connection.query(query, (error,res)=>{
    
                        if(error)
                        {
                            console.log("11");
                       resolve("ERROR")
                       // resolve(false)
                        }
    
                        console.log("res");
                        resolve(res)
                    });
                 
                    connection.release();
                   
                });





            })

        
        }
        catch(exe){}

    }

}

module.exports=new DeleteMeDb();
 
exports.delete = async (req,res) =>{

    console.log("1")
var res= await dme.executeQuery("select * from student_master","");
if(res == 'ERROR')

console.log("2")


}