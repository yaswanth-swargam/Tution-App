import app from './app.js'
import pool from './lib/db.js'


const PORT=process.env.PORT || 3000;

const server =async ()=>{
  try{
    const connection=await pool.getConnection()
    console.log('Database connected')
    connection.release();

    app.listen(PORT,()=>{
      console.log('Server running at : ',PORT)
    })
  }
  catch(e){
    console.error('failed to connect database',e.message)
  }
}

server();