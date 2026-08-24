export class HealthService {
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }
}