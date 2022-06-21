from pyteal import *
from pyteal_helpers import program
# from pyteal.ast.bytes import Bytes

def approval():
  return program.event(
    init=Approve(),
    no_op=Cond(
      [Txn.application_args[0] != Txn.sender(), Approve()]
    )
  )

def clear():
  return Approve()