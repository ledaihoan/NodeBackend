import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const db = mongoose.connection;
//Removes the warning with promises
mongoose.Promise = global.Promise;

//Connect the db with the url provided
async function initDb() {
    let result = false;
    try {
        const conn = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true , useUnifiedTopology: true });
        conn.once('open', () => console.log('MongoDB Running')).on('error', e => {
            console.log('DB connection error:', e.message);
        });
        result = true;
    } catch (err) {
        console.log('url = ' + process.env.DB_URL);
        mongoose.createConnection(process.env.DB_URL)
    }
    db.once('open', () => console.log('MongoDB Running')).on('error', e => {
        console.log('DB connection error:', e.message);
    });
    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0);
        });
    });
    return result;
}

export default initDb;