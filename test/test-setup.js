// Global test setup to fix getLibs() undefined issue
import { setLibs } from '../express/code/scripts/utils.js';

// Initialize getLibs() for all tests
setLibs('/libs');

// Set test environment flag
window.isTestEnv = true;
