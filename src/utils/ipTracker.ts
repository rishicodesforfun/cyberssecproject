interface IPRecord {
  ip: string;
  timestamp: string;
  userAgent: string;
  path: string;
  method: string;
}

class IPTracker {
  private storageKey = 'ipdr_ip_records';

  // Get current IP address (simulated for demo)
  async getCurrentIP(): Promise<string> {
    // In a real implementation, you would call an IP detection API
    // For demo purposes, we'll generate a random IP
    const randomIP = () => Math.floor(Math.random() * 255) + '.' + 
                     Math.floor(Math.random() * 255) + '.' + 
                     Math.floor(Math.random() * 255) + '.' + 
                     Math.floor(Math.random() * 255);
    return randomIP();
  }

  // Get user agent string
  getUserAgent(): string {
    return navigator.userAgent || 'Unknown';
  }

  // Record IP access
  async recordAccess(path: string, method: string = 'GET'): Promise<void> {
    try {
      const ip = await this.getCurrentIP();
      const userAgent = this.getUserAgent();
      const timestamp = new Date().toISOString();

      const record: IPRecord = {
        ip,
        timestamp,
        userAgent,
        path,
        method
      };

      // Get existing records
      const existingRecords = this.getRecords();
      
      // Add new record
      existingRecords.push(record);
      
      // Keep only last 1000 records to prevent storage issues
      const trimmedRecords = existingRecords.slice(-1000);
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedRecords));

      // In a real implementation, you would also send this to your backend
      console.log('IP access recorded:', record);
      
    } catch (error) {
      console.error('Error recording IP access:', error);
    }
  }

  // Get all recorded IP addresses
  getRecords(): IPRecord[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading IP records:', error);
      return [];
    }
  }

  // Get unique IP addresses
  getUniqueIPs(): string[] {
    const records = this.getRecords();
    const uniqueIPs = [...new Set(records.map(record => record.ip))];
    return uniqueIPs;
  }

  // Get access statistics
  getStats() {
    const records = this.getRecords();
    const uniqueIPs = this.getUniqueIPs();
    
    return {
      totalAccesses: records.length,
      uniqueIPs: uniqueIPs.length,
      lastAccess: records.length > 0 ? records[records.length - 1].timestamp : null,
      firstAccess: records.length > 0 ? records[0].timestamp : null
    };
  }

  // Clear all records (admin function)
  clearRecords(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const ipTracker = new IPTracker();
export default IPTracker;