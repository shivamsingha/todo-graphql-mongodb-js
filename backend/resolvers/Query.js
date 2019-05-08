function feed(parent, args, context, info) {
    const r = await context.db.collection('tasks').find().toArray()
    return r
}
  
module.exports = {
    feed,
}  