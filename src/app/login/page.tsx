export default function Login() {
  return (
    <main>
        <h1>Log In</h1>
        <form>
            <label htmlFor="username" >Username</label><br />
            <input id="username" name="username" type="text" /><br />

            <label htmlFor="password" >Password</label><br />
            <input id="password" name="password" type="password" /><br />

            {/* Submit Button */}
            <button type="submit" >Submit</button>
        </form>
    </main>
  );
}