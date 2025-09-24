export default function Login() {
  return (
    <main>

        <div className="bg-black w-full min-h-screen flex justify-center items-center;">
            <div className="bg-white w-[500px] p-8 rounded shadow-lg;">
                <h1 className="text-black text-2xl font-mono;" >Log In</h1>
                <form>
                    <label htmlFor="username" >Username</label><br />
                    <input className="box" id="username" name="username" type="text" /><br />

                    <label htmlFor="password" >Password</label><br />
                    <input className="box" id="password" name="password" type="password" /><br />

                    {/* Submit Button */}
                    <button className="btn" type="submit" >Submit</button>
                </form>
            </div>
        </div>

    </main>
  );
}