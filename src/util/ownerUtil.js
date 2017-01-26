require('babel-polyfill')


export default async function(req, rolesConfig){


  const model = req.options.model
  const modelId = req.params.id

  if(!req.user || !req.user.id) return false

  const userId = req.user.id
  const modelInDb = await sails.models[model].findOne(modelId).populate('owner')

  if(!modelInDb) throw new Error('model not found - id given in parameter is not valid')


  // Highest role bypass everything
  if(req.user.role === rolesConfig[0]) return true

  if('owner' in modelInDb){

    const container = modelInDb.owner

    if(container instanceof Array){

      for(let owner of container){

        // owner is an id
        if(typeof owner === 'string'){
          if(owner === userId) return true

        // owner is an object and we expect an id parameter inside
      }else if('id' in owner){
          if(owner.id === userId) return true
        }
      }

    }else{
      if(typeof container === 'string'){
        return container === userId

      }else if('id' in container){
        return container.id === userId
      }
    }

  }

  return false
}
