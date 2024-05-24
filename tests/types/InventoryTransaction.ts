type InventoryTransaction = {
  PrimaryKey: string
  CreatedBy: string
  ModifiedBy: string
  'Lot Number': string
  Description: string
  Type: string
  Units: number
  ForeignKey: string
  Date: string
  CreationTimestamp: number
  ModificationTimestamp: number
}

export default InventoryTransaction
