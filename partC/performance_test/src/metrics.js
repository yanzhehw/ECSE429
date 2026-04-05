const os = require('os');

function getCpuInfo() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) total += cpu.times[type];
        idle += cpu.times.idle;
    }
    return { idle, total };
}

async function measureSystem(windowMs = 500) {
    const startCpu = getCpuInfo();
    await new Promise(resolve => setTimeout(resolve, windowMs));
    const endCpu = getCpuInfo();
    
    const idleDiff = endCpu.idle - startCpu.idle;
    const totalDiff = endCpu.total - startCpu.total;
    
    const cpuPercent = 100 - (100 * idleDiff / totalDiff);
    const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
    
    return { cpuPercent: cpuPercent.toFixed(2), freeMemMB };
}

module.exports = { measureSystem };