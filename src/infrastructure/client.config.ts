const ENV = process.env.NODE_ENV;

const clientConfig = {
    ENV,
    BASE_URLS:
        ENV === "production" ? {
            AUTH: '',
            USER: '',
            PLAN: '',
            PROJECT: ''
        } : {
            AUTH: 'http://localhost:3000/api/auth',
            USER: 'http://localhost:3000/api/user',
            PLAN: 'http://localhost:3000/api/plan',
            PROJECT: 'http://localhost:3000/api/project'
        }
}

export default clientConfig;