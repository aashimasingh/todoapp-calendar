const axios = require('axios');
const Eventdes = require('./eventdes');

const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');

const EventType = new GraphQLObjectType( {
    name: 'eventType',
    fields: () => ({
       event_date: {type: GraphQLString},
       event_description: {type: GraphQLString} 
    })
})

const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        eventdet: {
            type: EventType,
            args: {
                //event_date: {type: GraphQLString}
                id : {type : GraphQLID}
            },
            resolve(parents, args) {
                //return axios.get('http://localhost:5000/events/'+args.event_date).then(res => res.data);
                //return Eventdes.find({event_date: args.event_date}, 'event_date event_description');
                return Eventdes.findById(args.id);
            }
        },
        allevents: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Eventdes.find({});
            }
        }
    }
})

const mutation = new GraphQLObjectType( {
    name: 'Mutation',
    fields: {
        addEvent: {
            type: EventType,
            args: {
                event_date: {type: new GraphQLNonNull(GraphQLString)},
                event_description: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parents, args){
                /*return axios.post('http://localhost:5000/todo/', {
                    event_date: args.event_date,
                    event_description: args.event_description
                }).then(res => res.data);*/
                let ev = new Eventdes({
                    event_date: args.event_date,
                    event_description: args.event_description
                })
                return ev.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
  });