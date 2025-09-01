import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';

export interface OrderCreationAttrs {
  id?: string;
  userSub: string;
  totalAmount: number;
  currency: string;
  status?: 'PENDING' | 'PAID' | 'CANCELLED';
}

@Table({
  tableName: 'orders',
  schema: 'orders',
  timestamps: true,
})
export class Order extends Model<Order, OrderCreationAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @Column({ type: DataType.STRING })
  userSub!: string; // JWT sub

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    get(this: Order) {
      const v = this.getDataValue('totalAmount') as unknown as string | null;
      return v == null ? v : Number(v);
    },
  })
  totalAmount!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  currency!: string;

  @AllowNull(false)
  @Default('PENDING')
  @Column(DataType.ENUM('PENDING', 'PAID', 'CANCELLED'))
  status!: 'PENDING' | 'PAID' | 'CANCELLED';

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;
}
