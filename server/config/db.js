import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is the server/config/ directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// data/ always lives at the project root (one level above server/)
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultData = {
  users: [],
  jobs: [],
  applications: [],
};

class JsonDB {
  constructor() {
    this.filePath = path.join(DATA_DIR, 'database.json');
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  _read() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('DB read error:', err.message);
      throw new Error('Database read failed. Please contact support.');
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('DB write error:', err.message);
      throw new Error('Database write failed. The server may have a permissions issue.');
    }
  }


  // --- Users ---
  getUsers() {
    return this._read().users;
  }

  getUserById(id) {
    return this._read().users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    return this._read().users.find((u) => u.email === email) || null;
  }

  createUser(user) {
    const data = this._read();
    data.users.push(user);
    this._write(data);
    return user;
  }

  // --- Jobs ---
  getJobs(filters = {}) {
    let jobs = this._read().jobs;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (filters.category) {
      jobs = jobs.filter(
        (j) => j.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.type) {
      jobs = jobs.filter(
        (j) => j.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    if (filters.postedBy) {
      jobs = jobs.filter((j) => j.postedBy === filters.postedBy);
    }

    // Sort by newest first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jobs;
  }

  getJobById(id) {
    return this._read().jobs.find((j) => j.id === id) || null;
  }

  getFeaturedJobs(limit = 6) {
    const jobs = this._read().jobs;
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jobs.slice(0, limit);
  }

  getCategoryCounts() {
    const jobs = this._read().jobs;
    const counts = {};
    jobs.forEach((j) => {
      counts[j.category] = (counts[j.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  createJob(job) {
    const data = this._read();
    data.jobs.push(job);
    this._write(data);
    return job;
  }

  deleteJob(id) {
    const data = this._read();
    const idx = data.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    data.jobs.splice(idx, 1);
    this._write(data);
    return true;
  }

  // --- Applications ---
  getApplicationsByApplicant(userId) {
    const data = this._read();
    return data.applications
      .filter((a) => a.applicantId === userId)
      .map((a) => ({
        ...a,
        job: data.jobs.find((j) => j.id === a.jobId) || null,
      }));
  }

  getApplicationsByJob(jobId) {
    const data = this._read();
    return data.applications
      .filter((a) => a.jobId === jobId)
      .map((a) => {
        const user = data.users.find((u) => u.id === a.applicantId);
        return {
          ...a,
          applicant: user ? { id: user.id, name: user.name, email: user.email } : null,
        };
      });
  }

  getApplication(jobId, applicantId) {
    return this._read().applications.find(
      (a) => a.jobId === jobId && a.applicantId === applicantId
    ) || null;
  }

  createApplication(application) {
    const data = this._read();
    data.applications.push(application);
    this._write(data);
    return application;
  }

  updateApplicationStatus(id, status) {
    const data = this._read();
    const app = data.applications.find((a) => a.id === id);
    if (!app) return null;
    app.status = status;
    this._write(data);
    return app;
  }
}

const db = new JsonDB();
export default db;
