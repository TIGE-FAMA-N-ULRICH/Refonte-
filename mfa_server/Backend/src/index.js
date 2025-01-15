// import express, { json, urlencoded } from 'express';
// import session from 'express-session';
// import passport from 'passport';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { dbConnect } from './config/dbConnect.js';
// import authRoutes from './routes/authRoutes.js';
// import './config/passportConfig.js';

// dotenv.config();
// dbConnect();

// const app = express();

// //Middlewares
// const corsOptions = {
//     //origin: process.env.FRONTEND_URL,
//     origin: 'http://localhost:3001',
//     credentials: true,
//     //optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
// app.use(json({limit: "100mb"}));
// app.use(urlencoded({limit: "100mb", extended: true}));
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || "secret",
//         resave: false,
//         saveUninitialized: false,
//         cookie:{
//             maxAge: 60000 * 60,
//         },
//     })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api/auth', authRoutes);

// //Listen app
// const PORT = process.env.PORT || 7002;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


import express, { json, urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import './config/passportConfig.js';

dotenv.config();
dbConnect();

const app = express();

// Middlewares
const corsOptions = {
    origin: 'http://192.168.150.138:3001', 
    credentials: true,
};
app.use(cors(corsOptions));
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);

// Listen app
const PORT = process.env.PORT || 7002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://${process.env.HOST || '192.168.150.138'}:${PORT}`);
});
