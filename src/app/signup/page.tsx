export default function Signup() {
  return (
    <main>
        <h1>Create an Account</h1>
        <form>
            <label htmlFor="name" >Name</label><br />
            <input id="name" type="text"/><br />

            <label htmlFor="email ">Email</label><br />
            <input id="email" type="email" /><br />

            <label htmlFor="bio" >Bio</label><br />
            <textarea id="bio" name="bio" ></textarea><br />

            <label htmlFor="username" >Username</label><br />
            <input id="username" name="username" type="text" /><br />

            <label htmlFor="password" >Password</label><br />
            <input id="password" name="password" type="password" /><br />

            <label htmlFor="confirmPassword" >Confirm Password</label><br />
            <input id="confirmPassword" name="confirmPassword" type="password" /><br />

            {/* Submit Button */}
            <button type="submit" >Submit</button>
        </form>
    </main>
  );
}