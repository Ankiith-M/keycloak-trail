// users/src/models/user-profile.model.ts
import {
  Table, Column, Model, PrimaryKey, AllowNull, Unique,
  CreatedAt, UpdatedAt, DataType
} from 'sequelize-typescript';

export interface UserProfileCreationAttrs {
  sub: string;
  email?: string | null;
  displayName?: string | null;
}

@Table({
  tableName: 'user_profiles',
  schema: 'users',
  timestamps: true,
})

export class UserProfile extends Model<UserProfile, UserProfileCreationAttrs> {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  sub!: string;

  @AllowNull(true)
  @Unique
  @Column({ type: DataType.STRING })
  email?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  displayName?: string | null;

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;
}
