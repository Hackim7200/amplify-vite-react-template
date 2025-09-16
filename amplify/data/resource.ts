import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Define all models in a single schema - this is the recommended Gen 2 approach
const schema = a.schema({
  User: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  BreakdownItem: a.customType({
    //cant use default within custom type!!
    activity: a.string().required(),
    minutesElapsed: a.integer().required(),
    type: a.string().required(),
  }),

  Todo: a
    .model({
      content: a.string().required(),
      isDone: a.boolean().required(),
      // pomodoros: a.integer().default(1),
      date: a.datetime().required(),
      breakdown: a.ref("BreakdownItem").array(), // Array of breakdown items
    })
    .authorization((allow) => [allow.owner()]),

  Event: a
    .model({
      title: a.string().required(),
      icon: a.integer().required(),
      date: a.datetime().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
