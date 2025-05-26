import Redis from "ioredis";
const redis = new Redis({
    host : "redis-15934.c85.us-east-1-2.ec2.redns.redis-cloud.com",
    port : 15934,
    password : "hfXDTgAn8to01G13TV2XscPUHKD2tVFv"
});

export default redis;