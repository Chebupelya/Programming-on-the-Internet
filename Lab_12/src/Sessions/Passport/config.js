import passport from "passport";
import LocalStrategy from 'passport-local';
import users from '../Data/auth.json' assert { type: "json" };

passport.use(
    new LocalStrategy(
        async (username, password, done) => {

            const user = users.find(user => user.username === username && user.password === password);

            if (!user)
                return done(new Error(" User doesn`t exists"), false);

            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    const user = users.find(user => user.id === userId);
    done(null, user);
});

export { passport };
