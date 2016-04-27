var startServer = require('./startCacheServer');

// Root
startServer(8000, 'dist');

// Contract
startServer(9999, 'src-contract-app');

// Schufa
startServer(9888, 'src-schufa-app');

// Job Search
startServer(9898, 'src-job-search-app');

// Wizard
startServer(9899, 'src-wizard-app');
