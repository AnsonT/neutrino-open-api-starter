export function getFoo (req, res) {
  console.log(this.dependencies)
  res.send('fooo')
}
