import { PkEntity } from "src/common/base/pkEntity.base"
import {
    Entity,
    Tree,
    Column,
    TreeChildren,
    TreeParent,
} from "typeorm"

@Entity()
@Tree("closure-table")
export class Menu extends PkEntity{
    @Column('varchar', {
        nullable: false,
        length: 100
    })
    name: string

    @Column('varchar', {
        nullable: false,
        length: 300
    })
    path: string

    @TreeChildren()
    children: Menu[]

    @TreeParent()
    parent: Menu
}