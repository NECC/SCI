import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { AnyAaaaRecord } from 'dns';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','name','role','points']);

export const ActivityScalarFieldEnumSchema = z.enum(['id','title','description','date','startTime','endTime','location','capacity','speakers','type']);

export const EnrollmentsScalarFieldEnumSchema = z.enum(['id','userId','activityId','attended']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const Types = [ "WORKSHOP", "TALK", "OTHER", "TERTULIA" ] as const;
export const TypeSchema = z.enum(Types);

export type TypeType = `${z.infer<typeof TypeSchema>}`

export const RoleSchema = z.enum(['USER','ADMIN','STAFF']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const FormattedCourses = ["Biologia Aplicada", "Biologia e Geologia", "Bioquímica", "Ciência de Dados", "Ciências da Computação", "Ciências do Ambiente", "Estatística Aplicada", "Física", "Geologia", "Matemática", "Optometria e Ciências da Visão ", "Química"] as const;

export const Courses = ["BIOLOGIA_APLICADA", "BIOLOGIA_E_GEOLOGIA", "BIOQUIMICA", "CIENCIA_DE_DADOS", "CIENCIAS_DA_COMPUTACAO", "CIENCIAS_DO_AMBIENTE", "ESTATISTICA_APLICADA", "FISICA", "GEOLOGIA", "MATEMATICA", "OPTOMETRIA_E_CIENCIAS_DA_VISAO", "QUIMICA"] as const;

export const CourseSchema = z.enum(Courses);

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  graduation: CourseSchema.nullable(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  academicNumber: z.number().min(1).nullable(),
  courseYear: z.number().min(1).max(3).nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACTIVITY SCHEMA
/////////////////////////////////////////

export const ActivitySchema = z.object({
  type: TypeSchema,
  title: z.string().min(1),
  description: z.string(),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  capacity: z.preprocess( Number, z.number()),
  speakers: z.string()
})

export type Activity = z.infer<typeof ActivitySchema>

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