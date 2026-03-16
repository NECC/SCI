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

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','name','role','accredited','points','rewarded','academicNumber','graduation','courseYear']);

export const ActivityScalarFieldEnumSchema = z.enum(['id','title','description','date','startTime','endTime','location','capacity','speakers','type','picUrl','points']);

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
  academicNumber: z.number().min(1).nullable(),
  courseYear: z.number().min(1).max(3).nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACTIVITY SCHEMA
/////////////////////////////////////////

export const ActivitySchema = z.object({
    type: TypeSchema,
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    capacity: z.number().int(),
    speakers: z.string(),
    endTime: z.string(),
    startTime: z.string(),
    points: z.number().int(),
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

/////////////////////////////////////////
// CREATE USER SCHEMA
/////////////////////////////////////////

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role: RoleSchema.optional(),
  accredited: z.boolean().optional(),
  points: z.number().optional(),
  rewarded: z.number().optional(),
  hasTicket: z.boolean().optional(),
  academicNumber: z.number().int().min(1).optional().nullable(),
  graduation: CourseSchema.optional().nullable(),
  courseYear: z.number().int().min(1).max(3).optional().nullable(),
})