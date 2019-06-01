import bcrypt from 'bcrypt';

export function comparePassword (password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, match) => {
            console.log(err)
            return err ? reject(err) : resolve(match);
        })
    })
}

export function saltHashPassword (password: string): Promise<{hash: string, salt: string}>  {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }
    
            bcrypt.hash(password, salt, (err, hash) => {
                return err ? reject(err) : resolve({ hash, salt });
            })
        })
    })   
}