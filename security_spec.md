# Security Specification: FlowBudget

## Data Invariants
1. **UserId Isolation**: A user must only read and write documents in paths where the `{userId}` matches their `request.auth.uid`.
2. **Transaction Integrity**: Transactions require a non-negative number for amount, a non-empty string for title, a type of either `income` or `expense`, and a valid timestamp.
3. **Category Bounding**: Categories of transactions and budgets must restrict themselves to valid categories (food, transport, bills, entertainment, salary, other) with reasonable size parameters.
4. **Savings Goal Limits**: Savings goals in settings must be positive numbers.
5. **No System Overwrite**: A user cannot modify or inject unexpected roles or fields on user documents.

---

## The "Dirty Dozen" Payloads (Identified Exploits)

1. **Exploit 01: Shadow Update Attempt**
   - *Target*: `users/victim_user/transactions/tx_123`
   - *Attack Payload*: `{ id: "tx_123", amount: 15.00, title: "Burgers", type: "expense", category: "food", date: Timestamp, adminPrivileges: true }`
   - *Core Gate*: Handled via strict schema validation. Deny if payload keys include fields outside the schema.

2. **Exploit 02: PII Cross-Read (PII Blanket)**
   - *Target*: Read `users/victim_user/settings/preferences` as `attacker_user_1`
   - *Core Gate*: Denied via path-bound check: `request.auth.uid == userId`.

3. **Exploit 03: Spoof Email Verification**
   - *Target*: Write settings under `users/attacker_user` using an unverified email claiming admin privileges.
   - *Core Gate*: Prevented by validating `request.auth.token.email_verified == true` for standard actions if desired, but primarily restricting settings to the specific `request.auth.uid == userId` and blocking self-promotion.

4. **Exploit 04: Resource/ID Poisoning (Denial of Wallet)**
   - *Target*: Create transaction with a 2MB string for transactionId.
   - *Core Gate*: Handled by enforcing `isValidId(transactionId)` where length <= 128 and matches `^[a-zA-Z0-9_\-]+$`.

5. **Exploit 05: Negative Transaction Amount (Malicious Integrity)**
   - *Target*: Create a transaction with amount `-5500`.
   - *Core Gate*: Handled in type validation: `incoming().amount > 0`.

6. **Exploit 06: Invalid Type Injection (Value Poisoning)**
   - *Target*: Create transaction with `type: "gift"`.
   - *Core Gate*: `incoming().type in ["income", "expense"]`.

7. **Exploit 07: Sibling Impersonation**
   - *Target*: Create a transaction under `users/my_user/transactions/tx_123` with field `userId: "other_user"`.
   - *Core Gate*: Checks that referenced ownership fields (if present) match `request.auth.uid` or matches path variables.

8. **Exploit 08: Sibling Document Bypass**
   - *Target*: Update standard limits of other users categories.
   - *Core Gate*: Denied because budget collection path is `/users/{userId}/budgets/{budgetId}`, secured via `request.auth.uid == userId`.

9. **Exploit 09: Illegal Date Override (Temporal Poisoning)**
   - *Target*: Set `date` parameter in the future or direct client override.
   - *Core Gate*: In a real database we validate using `request.time`. Transaction date is standard timestamp format.

10. **Exploit 10: Empty Budget Limit**
    - *Target*: Setting limit to negative number.
    - *Core Gate*: Let's check `limit >= 0`.

11. **Exploit 11: Empty/Huge Titles**
    - *Target*: Title length of 1 million characters as a transaction description.
    - *Core Gate*: `.size() <= 200` limit on strings.

12. **Exploit 12: Admin Spoofing via Roles**
    - *Target*: Setting a custom admin claim.
    - *Core Gate*: Firestore rules do not trust token claims for access control.

---

## Verification Test Run
We will verify these rules using the `eslint-plugin-security-rules` linter and ensure rules safely block all cross-user edits and schema failures.
