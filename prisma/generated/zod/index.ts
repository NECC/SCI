import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','name','role','accredited','points','rewarded','hasTicket','academicNumber','graduation','courseYear']);

export const ActivityScalarFieldEnumSchema = z.enum(['id','title','description','date','location','capacity','type','endTime','startTime','url','points']);

export const SpeakerScalarFieldEnumSchema = z.enum(['id','name','picUrl']);

export const EnrollmentsScalarFieldEnumSchema = z.enum(['id','userId','activityId','attended']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const TypeSchema = z.enum(['WORKSHOP','TALK','TERTULIA','OTHER']);

export type TypeType = `${z.infer<typeof TypeSchema>}`

export const RoleSchema = z.enum(['USER','ADMIN','STAFF']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const CourseSchema = z.enum(['BIOLOGIA_APLICADA','BIOLOGIA_E_GEOLOGIA','BIOQUIMICA','CIENCIA_DE_DADOS','CIENCIAS_DA_COMPUTACAO','CIENCIAS_DO_AMBIENTE','ESTATISTICA_APLICADA','FISICA','GEOLOGIA','MATEMATICA','OPTOMETRIA_E_CIENCIAS_DA_VISAO','QUIMICA']);

export type CourseType = `${z.infer<typeof CourseSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  graduation: CourseSchema.nullable(),
  id: z.string().uuid(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  accredited: z.boolean(),
  points: z.number().int(),
  rewarded: z.number().int(),
  hasTicket: z.boolean(),
  academicNumber: z.number().min(1).nullable(),
  courseYear: z.number().min(1).max(3).nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACTIVITY SCHEMA
/////////////////////////////////////////

export const ActivitySchema = z.object({
  type: TypeSchema,
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.coerce.date(),
  location: z.string(),
  capacity: z.number().int().nullable(),
  endTime: z.string(),
  startTime: z.string(),
  url: z.string().nullable(),
  points: z.number().int(),
  achievement:z.string(),
  sponsor:z.string(),
})

export type Activity = z.infer<typeof ActivitySchema>

/////////////////////////////////////////
// SPEAKER SCHEMA
/////////////////////////////////////////

export const SpeakerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  picUrl: z.string().nullable(),
})

export type Speaker = z.infer<typeof SpeakerSchema>

/////////////////////////////////////////
// ENROLLMENTS SCHEMA
/////////////////////////////////////////

export const EnrollmentsSchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  activityId: z.number().int(),
  attended: z.boolean(),
})

export type Enrollments = z.infer<typeof EnrollmentsSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>