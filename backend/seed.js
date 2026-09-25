/**
 * AI-Solutions — Database Seed Script
 * =====================================
 * Run this ONCE to populate the database with:
 *   - 1 admin account
 *   - 4 solutions
 *   - 4 case studies
 *   - 3 articles
 *   - 2 events
 *   - 3 approved feedback entries
 *
 * Usage:
 *   cd ai-solutions-backend
 *   node seed.js
 *
 * WARNING: Running this again will insert duplicate data.
 * To reset completely, drop your MongoDB collections first.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ─── Models ──────────────────────────────────────────────────────────────────
const Admin     = require('./models/Admin');
const Solution  = require('./models/Solution');
const CaseStudy = require('./models/CaseStudy');
const Article   = require('./models/Article');
const Event     = require('./models/Event');
const Feedback  = require('./models/Feedback');

// ─── Connect ──────────────────────────────────────────────────────────────────
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────
  console.log('👤 Seeding admin...');
  let admin = await Admin.findOne({ username: 'admin' });
  if (admin) {
    console.log('   Admin already exists — skipping.\n');
  } else {
    admin = await Admin.create({
      username:     'admin',
      passwordHash: 'Admin@123456',   // hashed by the pre-save hook
      email:        process.env.ADMIN_EMAIL || 'admin@ai-solutions.com',
    });
    console.log('   ✅ Admin created');
    console.log('   Username : admin');
    console.log('   Password : Admin@123456');
    console.log('   ⚠️  Change this password after first login!\n');
  }

  // ─── Solutions ──────────────────────────────────────────────────────────────
  console.log('💡 Seeding solutions...');
  const solutionCount = await Solution.countDocuments();
  if (solutionCount > 0) {
    console.log('   Solutions already exist — skipping.\n');
  } else {
    await Solution.insertMany([
      {
        createdBy:   admin._id,
        title:       'AI Virtual Assistant',
        description: 'An intelligent conversational assistant that handles employee queries, automates routine support tasks, and proactively surfaces relevant information — reducing resolution times by up to 60%.',
        iconOrImage: null,
      },
      {
        createdBy:   admin._id,
        title:       'Predictive Issue Detection',
        description: 'Machine learning models that monitor digital systems in real time, identifying anomalies and predicting failures before they impact employees — keeping productivity at its peak.',
        iconOrImage: null,
      },
      {
        createdBy:   admin._id,
        title:       'Rapid AI Prototyping',
        description: 'From concept to working prototype in weeks, not months. We help organisations validate AI ideas quickly using lightweight, cost-effective models before committing to full development.',
        iconOrImage: null,
      },
      {
        createdBy:   admin._id,
        title:       'Workflow Automation Platform',
        description: 'End-to-end automation of repetitive digital workflows using AI-driven decision engines — freeing your teams to focus on high-value, creative work.',
        iconOrImage: null,
      },
    ]);
    console.log('   ✅ 4 solutions created\n');
  }

  // ─── Case Studies ───────────────────────────────────────────────────────────
  console.log('📁 Seeding case studies...');
  const csCount = await CaseStudy.countDocuments();
  if (csCount > 0) {
    console.log('   Case studies already exist — skipping.\n');
  } else {
    await CaseStudy.insertMany([
      {
        createdBy: admin._id,
        title:     'AI-Powered IT Support for NHS Trust',
        industry:  'Healthcare',
        summary:   'A large NHS Trust was struggling with a backlog of IT support tickets, with average resolution times exceeding 48 hours. AI-Solutions deployed a virtual assistant trained on the Trust\'s internal knowledge base, enabling staff to self-resolve 70% of common issues instantly.',
        outcome:   'Reduced average ticket resolution time from 48 hours to under 4 hours.',
      },
      {
        createdBy: admin._id,
        title:     'Predictive Maintenance System for Manufacturing Plant',
        industry:  'Manufacturing',
        summary:   'A North East manufacturing firm faced costly unplanned downtime due to equipment failures. We implemented a real-time sensor monitoring system with a predictive ML model that flagged at-risk machinery 72 hours before failure.',
        outcome:   'Reduced unplanned downtime by 43% in the first six months.',
      },
      {
        createdBy: admin._id,
        title:     'Digital Employee Experience Platform — Local Council',
        industry:  'Public Sector',
        summary:   'A local authority needed to modernise its internal digital services to support hybrid working. AI-Solutions built a unified employee experience platform with AI-assisted onboarding, automated HR query handling, and personalised resource recommendations.',
        outcome:   'Employee satisfaction scores increased by 38% within 90 days of launch.',
      },
      {
        createdBy: admin._id,
        title:     'Automated Claims Processing for Insurance Provider',
        industry:  'Financial Services',
        summary:   'An insurance provider was processing thousands of routine claims manually. We designed an AI pipeline that extracted, classified, and validated claim data automatically, routing only complex cases to human agents.',
        outcome:   'Processing capacity increased by 5x with no additional headcount.',
      },
    ]);
    console.log('   ✅ 4 case studies created\n');
  }

  // ─── Articles ───────────────────────────────────────────────────────────────
  console.log('📰 Seeding articles...');
  const articleCount = await Article.countDocuments();
  if (articleCount > 0) {
    console.log('   Articles already exist — skipping.\n');
  } else {
    await Article.insertMany([
      {
        createdBy: admin._id,
        title:     'Why the Digital Employee Experience Is the Next Frontier for AI',
        body:      'The digital employee experience (DEX) has become one of the most important factors in workforce productivity, satisfaction, and retention. As organisations continue to adopt hybrid and remote working models, the tools and systems employees use every day have a direct impact on their ability to perform.\n\nAI-Solutions was founded on a simple belief: that AI should make work better for people, not just for the bottom line. By embedding intelligent automation into the tools employees already use, we help organisations reduce friction, resolve issues faster, and give their people back time to focus on what matters most.\n\nIn this article, we explore the key trends shaping DEX in 2025 and why AI is increasingly at the centre of every forward-thinking organisation\'s digital strategy.',
        status:    'published',
      },
      {
        createdBy: admin._id,
        title:     'From Chatbot to Colleague: The Evolution of AI Virtual Assistants',
        body:      'Early chatbots were little more than scripted decision trees — useful for answering a narrow range of questions but frustrating the moment a user stepped outside the expected flow. Today, large language models have transformed what\'s possible.\n\nModern AI virtual assistants can understand context, remember previous interactions, and generate nuanced responses that feel genuinely helpful rather than robotic. For organisations, this represents a significant shift: AI is no longer a novelty or a cost-cutting measure — it\'s becoming a genuine colleague.\n\nAt AI-Solutions, our virtual assistant products are built on this new generation of AI technology. We design them not to replace human support teams, but to handle the high-volume, low-complexity queries that consume so much of their time — freeing people to focus on the work that truly requires human judgement and empathy.',
        status:    'published',
      },
      {
        createdBy: admin._id,
        title:     'The Case for Rapid AI Prototyping: Fail Fast, Learn Faster',
        body:      'One of the biggest barriers to AI adoption is the perceived risk of large-scale implementation. Organisations invest significant time and budget into AI projects, only to discover late in the process that the use case doesn\'t deliver the expected value.\n\nRapid prototyping changes this dynamic entirely. By building a lightweight, testable version of an AI solution in weeks rather than months, organisations can validate assumptions early, gather real user feedback, and make informed decisions about whether to proceed, pivot, or abandon an idea — before significant investment has been made.\n\nThis is the approach at the heart of AI-Solutions\' prototyping service. We work closely with our clients to understand their objectives, identify the riskiest assumptions, and design the simplest possible experiment that can test them. The result is faster learning, lower risk, and ultimately better AI products.',
        status:    'published',
      },
    ]);
    console.log('   ✅ 3 articles created\n');
  }

  // ─── Events ─────────────────────────────────────────────────────────────────
  console.log('📅 Seeding events...');
  const eventCount = await Event.countDocuments();
  if (eventCount > 0) {
    console.log('   Events already exist — skipping.\n');
  } else {
    await Event.insertMany([
      {
        createdBy:   admin._id,
        title:       'AI in the Workplace — Sunderland Summit 2025',
        description: 'Join AI-Solutions and industry leaders for a half-day summit exploring practical applications of artificial intelligence in the modern workplace. Sessions will cover employee experience, automation, and responsible AI deployment. Lunch and networking included.',
        eventDate:   new Date('2025-11-14T09:30:00Z'),
        location:    'Sunderland Software Centre, Sunderland, SR1 3LA',
      },
      {
        createdBy:   admin._id,
        title:       'Webinar: Getting Started with AI Prototyping',
        description: 'A free online session for business leaders and IT managers who want to understand how to quickly validate AI ideas without large upfront investment. AI-Solutions\' lead engineers will walk through real examples and answer your questions live.',
        eventDate:   new Date('2025-10-22T13:00:00Z'),
        location:    'Online (Zoom link sent on registration)',
      },
    ]);
    console.log('   ✅ 2 events created\n');
  }

  // ─── Feedback ───────────────────────────────────────────────────────────────
  console.log('⭐ Seeding feedback...');
  const feedbackCount = await Feedback.countDocuments();
  if (feedbackCount > 0) {
    console.log('   Feedback already exists — skipping.\n');
  } else {
    await Feedback.insertMany([
      {
        customerName: 'Sarah Mitchell',
        companyName:  'NorthEast NHS Trust',
        rating:       5,
        comment:      'AI-Solutions transformed how our IT support team operates. The virtual assistant handles the majority of our staff queries instantly, and our team can now focus on genuinely complex problems. Exceptional service from start to finish.',
        status:       'approved',
        reviewedBy:   admin._id,
      },
      {
        customerName: 'James Thornton',
        companyName:  'Thornton Engineering Ltd',
        rating:       5,
        comment:      'The predictive maintenance system they built for us has been a game changer. We used to lose entire production days to unexpected equipment failures. That simply does not happen anymore. Highly recommended.',
        status:       'approved',
        reviewedBy:   admin._id,
      },
      {
        customerName: 'Rebecca Clarke',
        companyName:  'City of Sunderland Council',
        rating:       4,
        comment:      'Working with AI-Solutions was a genuinely collaborative experience. They took time to understand our constraints as a public sector organisation and delivered a solution that our employees actually enjoy using. Very impressed.',
        status:       'approved',
        reviewedBy:   admin._id,
      },
    ]);
    console.log('   ✅ 3 feedback entries created\n');
  }

  // ─── Done ────────────────────────────────────────────────────────────────────
  console.log('─────────────────────────────────────────');
  console.log('✅ Seed complete!');
  console.log('');
  console.log('Admin login:');
  console.log('  URL      : http://localhost:3000/admin/login');
  console.log('  Username : admin');
  console.log('  Password : Admin@123456');
  console.log('');
  console.log('⚠️  Remember to:');
  console.log('  1. Change the admin password after first login');
  console.log('  2. Remove or disable the /api/admin/seed route in adminRoutes.js');
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
