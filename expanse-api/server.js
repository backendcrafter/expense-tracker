const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Groq = require('groq-sdk');
const cors = require('cors');
require('dotenv').config();
const groq = new Groq({ apiKey: process.env.GROQ_API });

const app=express();
app.use(express.json());
app.use(cors());

app.post('/register',async (req,res)=>{
    const {name, email, password}=req.body;
    const hashedPassword=await bcrypt.hash(password, 10);
    try {
        const result=await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',[name, email, hashedPassword]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/login',async (req,res)=>{
    const {email, password}=req.body;
    try {
        const result=await pool.query('SELECT * FROM users WHERE email=$1',[email]);
        if(result.rows.length===0){
            return res.status(400).json({message:"User not found"});
        }
        const user=result.rows[0];
        const isMatch=await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({id:user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.json({token});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

function authMiddleware(req, res, next) {
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({message:"Invalid token"});
    }
}

app.post('/expenses', authMiddleware, async (req,res)=>{
    const {title, amount, category, date}=req.body;
    const userId=req.user.id;
    try {
        const result=await pool.query('INSERT INTO expenses (user_id, title, amount, category, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',[userId, title, amount, category, date]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/expenses', authMiddleware, async (req,res)=>{
    const userId=req.user.id;
    try {
        const result=await pool.query('SELECT * FROM expenses WHERE user_id=$1',[userId]);
        res.json({ expenses: result.rows }); // correct
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.delete('/expenses/:id', authMiddleware, async (req,res)=>{
    const expenseId=req.params.id;
    const userId=req.user.id;
    try {
        const result=await pool.query('DELETE FROM expenses WHERE id=$1 AND user_id=$2 RETURNING *',[expenseId, userId]);
        if(result.rows.length===0){
            return res.status(404).json({message:"Expense not found"});
        }
        res.json({message:"Expense deleted"});
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/budget', authMiddleware, async (req,res)=>{
    const {monthly_salary, month}=req.body;
    const userId=req.user.id;
    try {
        const result=await pool.query('INSERT INTO budgets (user_id, monthly_salary, month) VALUES ($1, $2, $3) RETURNING *',[userId, monthly_salary, month]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding budget:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/budget', authMiddleware, async (req,res)=>{
    const userId=req.user.id;
    try {
        const month = new Date().toISOString().slice(0, 7) + '-01';
        const result = await pool.query(
          'SELECT * FROM budgets WHERE user_id=$1 AND month=$2',
          [userId, month]
        );
        res.json({ budget: result.rows }); // correct
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/insights', authMiddleware, async (req,res)=>{
    const {expenses, budget}=req.body;
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'user', content: `You are a master financial analyst and personal finance advisor with 20 years of experience. Analyze the following financial data and provide highly specific, actionable advice.

                User's Monthly Income: ₹${budget}
                Total Spent This Month: ₹${expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)}
                Remaining Balance: ₹${budget - expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)}
                                
                Expense Breakdown:
                ${JSON.stringify(expenses.map(e => ({ title: e.title, amount: e.amount, category: e.category })))}
                                
                Provide exactly 5 insights in this format:
                1. 📊 SPENDING ANALYSIS: Analyze their spending patterns specifically
                2. 💰 SAVING STRATEGY: Give a specific monthly saving target and how to achieve it
                3. 📈 INVESTMENT ADVICE: Based on their remaining balance, suggest specific investments (SIP, mutual funds, FD, etc.) with actual amounts
                4. ⚠️ WARNING: Identify their biggest financial risk right now
                5. 🎯 ACTION PLAN: Give 3 specific actions they should take this week
                                
                Be brutally honest. Use Indian financial context (₹, Indian markets, SIP, PPF, etc.). Give real numbers, not generic advice.` }
            ]
        });
        const insights = completion.choices[0].message.content;
        res.json({ insights });
    } catch (error) {
        console.error('Insights error details:', error.message, error.status);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));