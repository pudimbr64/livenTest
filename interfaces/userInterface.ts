import Address from '../interfaces/addressInterface'
interface User {
    id: number,
    name: string,
    birthdate: string,
    hash: string,
    salt: string,
    email: string,
    address?: Array<Address>
}

export default User;