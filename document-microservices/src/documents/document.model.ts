
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Document extends Model<Document> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userid: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filename: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimetype: string;


}
