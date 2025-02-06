export default function AboutPage(){
    return(
        <> 
            <h4>About</h4>

            <img src="/MERN-logo.png" alt="MERN Stack" 
                style={{
                    width: '50%',
                    marginLeft: '2rem',
                }} />
            <p>
                This website was created by Luke using the <b>MERN</b> stack, <b>MongoDB</b> 
                for the database, <b>Express.js</b> for the API backend, <b>React</b> for the 
                frontend, and <b>Node.js</b> for the runtime environment. The styling for the 
                page is implemented using <b>SASS</b>, a <b>CSS</b> preprocessor.
            </p>
            
            <p>
                Currently the site is hosted on my <b>Debian</b> home server, the frontend 
                is served by <b>Nginx</b>, while the backend API is managed by <b>pm2</b>. 
                To ensure secure HTTPS connections, I am using <b>Let's Encrypt</b> for SSL 
                certificates with automatic renewal scheduled twice a day using a <b>cron job</b>. 
                I am also using NewsAPI, ipapi, OpenWeather, and Deck of Cards API for various 
                parts of this page.
            </p>
        </>
    );
}