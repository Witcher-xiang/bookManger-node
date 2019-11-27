const {exec} = require('../db/mysql');

// 这里有两个逻辑 归还书籍和借出书籍
const handleBookOperate= (req,res)=>{
    const method = req.method;
    const path = req.path;
    const postData=req.body;

    // 借出书籍 bookLoan sNo
    // 这里有个小问题在使用前需要优先判断出是否存在这本书这里偷个懒
    if (method ==="POST"&&path==="/book/loanOut") {
        const bookLoan=postData.bookLoan||"";
        const sNo=postData.sNo||"";
        const studentSql=`update student set lbook='${bookLoan}' where sno='${sNo}'`;
        const bookSql=`update book set store=store-1 where bname='${bookLoan}'`;
        if (bookLoan && sNo){
            return exec(studentSql).then(
                res=>{
                    return   exec(bookSql).then(res01=>{
                        return {
                            res:res,
                            res01:res01,
                            status:true,
                            msg:"书籍成功借出"
                        }
                    })
                })
                .catch(err=>{console.log(err)})
        }
        return{
            msg:"书籍借出失败"
        }
    }
    // 归还书籍 bookReturn sNo
    // 这里有个小问题这里我还需要判断一下有没有这本书这里就懒得判断了有时间再修改
    if (method === "POST" && path === "/book/returnBack"){
        const bookReturn=postData.bookReturn||"";
        const sNo=postData.sNo||"";
        const studentSql=`update student set lbook='' where sno='${sNo}'`;
        const bookSql=`update book set store=store+1 where bname='${bookReturn}'`;
        if (bookReturn && sNo){
           return exec(studentSql).then(
               res=>{
             return   exec(bookSql).then(res01=>{
                 return {
                     res:res,
                     res01:res01,
                     status:true,
                     msg:"书籍归还成功"
                 }
             })
            })
               .catch(err=>{console.log(err)})
        }

        return {
            msg:"归还失败"
        }
    }

    }
module.exports =handleBookOperate;
