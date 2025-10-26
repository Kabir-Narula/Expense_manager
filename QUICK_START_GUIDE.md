# Quick Start Guide - Shared Account System

## 🎯 What Was Fixed

Your shared account system had several critical bugs that have now been fixed:

1. ✅ **Invitations now work properly** - Users receive notifications and must accept before joining
2. ✅ **No auto-switching accounts** - You stay on your selected account
3. ✅ **Proper membership validation** - No more "not a member" errors
4. ✅ **Transaction attribution** - See who created each transaction with avatars
5. ✅ **Better error messages** - Clear feedback on what went wrong

---

## 🚀 How to Use Shared Accounts

### For Account Owners:

#### 1. Create a Shared Account
- Log in to your personal account
- Click **"Create Shared Account"** button on dashboard
- Enter a name (e.g., "Family Budget", "Roommate Expenses")
- You are automatically the owner

#### 2. Invite Members
- Switch to your shared account using the account dropdown
- Click **"Invite Member"** button
- Enter the email address of an existing user
- Optionally add a message
- Click **"Send Invite"**

**Important:** The user must already be registered in your system!

#### 3. Manage Members
- Go to **"Manage Account"** page
- View all members with their roles
- Remove members (except yourself as owner)
- Delete the entire shared account if needed

### For Invited Users:

#### 1. Check for Invitations
- Log in to your account
- Look for the yellow **"Pending Invitations"** box on dashboard
- You'll see who invited you and to which account

#### 2. Accept or Decline
- Click **"Accept"** to join the shared account
- Click **"Decline"** to reject the invitation
- After accepting, the shared account appears in your account dropdown

#### 3. Switch Between Accounts
- Use the account dropdown in the sidebar
- Select "Personal" or any shared account you're a member of
- All transactions are scoped to the selected account

---

## 📊 Working with Transactions

### Creating Transactions
- Make sure you're on the correct account (check dropdown)
- Add income or expenses as usual
- Your name will be automatically recorded as the creator

### Viewing Transactions
- Go to Income or Expenses page
- Expand any month to see transactions
- Each transaction shows:
  - Creator's avatar (colored circle with initial)
  - Creator's full name
  - Amount, date, category/source

### Filtering by Member
- On the year view page, use the **"Filter by member"** dropdown
- Select "All" or a specific member
- Only that member's transactions will be shown

### Editing/Deleting Transactions
- **Owners** can edit/delete any transaction
- **Members** can only edit/delete their own transactions
- Edit and delete buttons only appear if you have permission

---

## 🔍 Troubleshooting

### "User with this email does not exist"
**Problem:** You're trying to invite someone who hasn't registered yet.
**Solution:** Ask them to sign up first, then invite them using their registered email.

### "Not a member of this account"
**Problem:** You're trying to access an account you're not part of.
**Solution:** 
- Check if you have a pending invitation to accept
- Ask the account owner to invite you
- Make sure you're logged in with the correct account

### "Invitation already pending"
**Problem:** You already sent an invitation to this user.
**Solution:** Wait for them to accept or decline. They need to log in to see it.

### Account automatically switching
**Problem:** This should be fixed now!
**Solution:** If it still happens, clear your browser's localStorage and log in again.

---

## 🧪 Testing Checklist

Before using in production, test these scenarios:

- [ ] Create a shared account
- [ ] Invite a user who exists
- [ ] Try to invite a user who doesn't exist (should fail)
- [ ] Try to invite yourself (should fail)
- [ ] Log in as invited user and accept invitation
- [ ] Switch between personal and shared accounts
- [ ] Create transactions in both accounts
- [ ] Verify transactions show correct creator
- [ ] Filter transactions by member
- [ ] Try to edit someone else's transaction (should fail for members)
- [ ] Remove a member as owner
- [ ] Verify removed member can't access account anymore

---

## 📁 Files Modified

### Backend:
- `backend/controllers/invitationController.js` - Fixed invitation flow and notifications
- `backend/middleware/accountContext.js` - Fixed membership validation

### Frontend:
- `frontend/src/context/AccountContext.jsx` - Fixed account switching logic
- `frontend/pages/Dashboard.jsx` - Enhanced invitation display
- `frontend/components/InviteMemberModal.jsx` - Added validation
- `frontend/pages/ExpenseByYear.jsx` - Added creator avatars
- `frontend/pages/IncomeByYear.jsx` - Added creator avatars
- `frontend/pages/ManageAccount.jsx` - Enhanced member display

---

## 🎨 UI Improvements

### Invitation Display
- Yellow highlighted box for pending invitations
- Shows invitation count
- Displays inviter's name and email
- Shows optional message from inviter
- Clear Accept/Decline buttons

### Transaction Creator Display
- Circular avatar with user's initial
- Color-coded (indigo for expenses, green for income)
- Full name displayed next to avatar
- Easy to scan and identify who created what

### Member Management
- Avatar for each member
- Role badges with icons (👑 for owner)
- Color-coded roles (purple for owner, blue for member)
- Hover effects for better UX

---

## 🔐 Permissions Summary

| Action | Owner | Member |
|--------|-------|--------|
| View account | ✅ | ✅ |
| Create transactions | ✅ | ✅ |
| Edit own transactions | ✅ | ✅ |
| Edit others' transactions | ✅ | ❌ |
| Delete own transactions | ✅ | ✅ |
| Delete others' transactions | ✅ | ❌ |
| Invite members | ✅ | ❌ |
| Remove members | ✅ | ❌ |
| Delete account | ✅ | ❌ |

---

## 📞 Support

If you encounter any issues:

1. Check the `SHARED_ACCOUNT_FIXES.md` file for detailed technical information
2. Review the console logs in browser DevTools (F12)
3. Check the backend server logs for error messages
4. Verify your MongoDB data is consistent

---

## 🎉 You're All Set!

Your shared account system is now fully functional. Start by:
1. Creating a test shared account
2. Inviting a test user
3. Accepting the invitation
4. Creating some transactions
5. Verifying everything works as expected

Happy budgeting! 💰

