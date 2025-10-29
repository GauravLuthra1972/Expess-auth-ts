import bcrypt from 'bcrypt'

const hash = "$2b$10$cO8VetMqYwXzVAYCYQWRH.dA9hqYyE4xIplW85V1ysbN82cqpF.KC";
const password = "admin928";

async function checkPassword() {
  const match = await bcrypt.compare(password, hash);
  console.log(match ? "Password is correct!" : "Password is incorrect.");
}

checkPassword();
