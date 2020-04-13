const Account = require("../models/account");
const Transaction = require("../models/transaction");

exports.createAccount = (req, res, next) => {
  const account = new Account({
    type: req.body.type,
    accountNumber: req.body.accountNumber,
    amount: req.body.amount,
    creator: req.userData.userId
  });
  account.save().then( result => {
    res.status(201).json({
      message: 'Account created succesfully',
      account : {
        ...result,
        id: result._id
      }
    });
  })
  .catch(error => {
    console.log(req);
    console.log(error);
    res.status(500).json({
      message: 'Account creation failed'
    })
  });
}

exports.getAccounts = (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const accountQuery = Account.find({creator: req.userData.userId});
  let fetchedAccounts;
  if (pageSize && currentPage) {
    accountQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  accountQuery.then(documents => {
    fetchedAccounts = documents;
    return Account.count();
  }).then(count => {
    res.status(200).json({
      message: 'Accounts sent succesfully',
      accounts: fetchedAccounts,
      maxAccounts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Get accounts failed!'
    })
  });
}

exports.getAccount = (req, res, next) => {
  console.log(req);
  Account.find({_id: req.params.id, creator: req.userData.userId})
  .then(account => {
    if(account) {
      res.status(200).json({
        message: 'Account sent succesfully',
        account: account
      });
    } else {
      res.status(404).json({
        message: 'Account not found',
        account: null
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Get Account Failed!'
    })
  });
}

exports.updateAccount = (req, res, next) => {
  const account = new Account({
    _id: req.params.id,
    type: req.body.type,
    accountNumber: req.body.accountNumber,
    amount: req.body.amount,
    creator: req.userData.userId
  });
   Account.updateOne({_id: req.params.id, creator: req.userData.userId}, account)
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'Account Updated'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Account update failed!'
    })
  });
}

exports.deleteAccount = (req, res, next) => {
  Account.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'Account Deleted'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Delete Account Failed!'
    })
  });
}

exports.creditAccount = (req, res, next) => {
  const account = new Account({
    _id: req.params.id,
    type: req.body.oldAccount.type,
    accountNumber: req.body.oldAccount.accountNumber,
    amount: req.body.oldAccount.amount + req.body.amount,
    creator: req.userData.userId
  });
  console.log(account);
  Account.updateOne({_id: req.params.id, creator: req.userData.userId}, account)
  .then(result => {
    if(result.n > 0) {
      const trxn = new Transaction({
        type: 'credit',
        desc: req.body.desc,
        accountId: req.params.id,
        amount: req.body.amount,
        date: new Date()
      });
      trxn.save().then(result => {
        console.log(trxn);
      });
      res.status(200).json({
        message: 'Account Credited'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Account credit failed!'
    })
  });
}

exports.debitAccount = (req, res, next) => {
  const account = new Account({
    _id: req.params.id,
    type: req.body.oldAccount.type,
    accountNumber: req.body.oldAccount.accountNumber,
    amount: req.body.oldAccount.amount - req.body.amount,
    creator: req.userData.userId
  });
   Account.updateOne({_id: req.params.id, creator: req.userData.userId}, account)
  .then(result => {
    if(result.n > 0) {
      const trxn = new Transaction({
        type: 'debit',
        desc: req.body.desc,
        accountId: req.params.id,
        amount: req.body.amount,
        date: new Date()
      });
      trxn.save().then(result => {
        console.log(trxn);
      });
      res.status(200).json({
        message: 'Account Debited'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Account debit failed!'
    })
  });
}

exports.getTrxns = (req, res, next) => {
  Transaction.find({accountId: req.params.id})
  .then(trxns => {
    if(trxns) {
      res.status(200).json({
        message: 'Trxns sent succesfully',
        trxns: trxns
      });
    } else {
      res.status(404).json({
        message: 'Trxns not found',
        trxns: null
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Get Trxns Failed!'
    })
  });
}
