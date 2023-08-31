# throttled-q

throttled-q is a job queue that throttle the job executions to a specific rate.

## Installation

`
npm i throttled-q
`

## Example

```javascript
const q = new JobQueue(1, 1000)

for (let i = 0; i < 10; i++) {
    await q.enqueue(() => console.log(i))
}
```



