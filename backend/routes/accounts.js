const express = require("express");

const checkAuth = require("../middleware/check-auth");

const AccountsController = require("../controllers/accounts");

const router = express.Router();

router.post("", checkAuth, AccountsController.createAccount);

router.get("", checkAuth, AccountsController.getAccounts);

router.get("/:id", checkAuth, AccountsController.getAccount);

router.put("/:id", checkAuth, AccountsController.updateAccount);

router.delete("/:id", checkAuth, AccountsController.deleteAccount);

router.post("/:id/credit", checkAuth, AccountsController.creditAccount);

router.post("/:id/debit", checkAuth, AccountsController.debitAccount);

router.get("/:id/trxns", checkAuth, AccountsController.getTrxns);

module.exports = router;
