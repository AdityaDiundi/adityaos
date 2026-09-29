"use client";

import React, { useState, useEffect } from "react";
import { Folder, FileText, ChevronRight, ChevronDown, Code2, RefreshCw, FolderPlus } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

export interface ArchiveItem {
  id: string;
  path: string;
  filename: string;
  title: string;
  category: string;
  extension: "md" | "txt";
  lines: string[];
}

const FALLBACK_ARCHIVE_DATA: Record<string, ArchiveItem> = {
  "essays/Daughters_of_Misogyny.md": {
    id: "daughters",
    path: "essays/Daughters_of_Misogyny.md",
    filename: "Daughters_of_Misogyny.md",
    title: "Daughters of Misogyny",
    category: "essays",
    extension: "md",
    lines: [
      "# Daughters of Misogyny",
      "",
      "*Date: 26 May, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/daughters-of-misogyny/*",
      "",
      "---",
      "",
      "*This world works in the strangest of the ways*",
      "*Girls are born to the most misogynistic of the men*",
      "*Some change, some remain the same*",
      "",
      "— Aditya",
    ],
  },
  "essays/On_Borrowed_Beliefs.md": {
    id: "beliefs",
    path: "essays/On_Borrowed_Beliefs.md",
    filename: "On_Borrowed_Beliefs.md",
    title: "On Borrowed Beliefs",
    category: "essays",
    extension: "md",
    lines: [
      "# On Borrowed Beliefs",
      "",
      "*Date: 01 Apr, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/on-borrowed-beliefs/*",
      "",
      "---",
      "",
      "I don't believe in God.",
      "",
      "Not in the one I was told about by my family. It was a choice I made, though I precisely don’t remember when. What I do remember is faith slowly being overtaken by a thought process that made it difficult for me to be a theist.",
      "",
      "This is not about whether the God I was told about exists or not. I am talking about the privilege I have been fortunate enough to have: the privilege of having parents who, though they still ask me not to eat non-veg on certain days, respect my denial whenever it comes up.",
      "",
      "I also often wonder about families where a belief system is taught right from infancy, and how such exposure shapes a person’s ability to question it, or even to have a choice about whether or not to follow it.",
      "",
      "— Aditya",
    ],
  },
    "essays/Identity_In_Youth_Clubs_In_India.md": {
    "id": "identity_in_youth_clubs_in_india",
    "path": "essays/Identity_In_Youth_Clubs_In_India.md",
    "filename": "Identity_In_Youth_Clubs_In_India.md",
    "title": "Identity In Youth Clubs In India",
    "category": "essays",
    "extension": "md",
    "lines": [
        "# Identity In Youth Clubs In India",
        "",
        "**Author:** Aditya Diundi  ",
        "**Publication:** India Fellow  ",
        "**Source Link:** [https://indiafellow.org/blog/all-posts/identity-in-youth-clubs-in-india/](https://indiafellow.org/blog/all-posts/identity-in-youth-clubs-in-india/)",
        "",
        "---",
        "",
        "Currently, in youth clubs, although there is togetherness and a sense of belonging among participants, these clubs are not operating at their full potential. The formation of identity in youth clubs is essential to creating a space that feels truly collective. Members are yet to reach a stage where we can call it a cohesive, collective space.",
        "",
        "Searching &#8216;Oldest Youth Club in India&#8216; gave some results with only two, which made sense. My search query could've been better too. Still, all I got was a page which had information about Mohun Bagan Athletic Club which is a football club founded in 1889 and Nehru Yuva Kendra Sangathan which happens to be the oldest youth organization established in 1972 to provide rural youth avenues to take part in the process of nation-building as well as provide opportunities for the development of identity in youth clubs.",
        "",
        "Now, where am I in all of this? For the past six months, I have lived in Thakurganj, Bihar, working with Project Potential to build a strong network of 400+ youths by forming clubs in neighbouring panchayats for youth empowerment. I am also a member of this network because of the nature of the system and my role in it. As an active member of these club spaces my job is to make sure that these spaces function effectively with sessions contributing towards the learning of every member.",
        "",
        "The objective of these spaces was to form a small collective of future leaders in multiple panchayats who are socially conscious, ambitious, and have a strong sense of agency. Currently, some clubs excel in various program and social metrics; however, others still need significant work to instil a sense of collective identity and self-awareness among members.",
        "",
        "",
        "### The Role of Identity In Youth Clubs",
        "",
        "",
        "Identity in itself is a compelling factor in contributing to collectivism. Imagine, it's your first day in a space where people of your age, some of your neighbours too are present and all you have are just introduced to the program that you have just become a part of and what will happen in the upcoming months. The idea of the space where this group exists can vary, but whether it resonates with its members is a key question. Organizers often highlight the club's benefits when mobilizing people but rarely mention that their values and actions may be challenged. This happens because the space is diverse by design, and everyone brings some level of individuality.",
        "",
        "> Some youths in our systems lack strong individuality and often align with the space's values. However, even when members align with program values, gaps in youth engagement remain.",
        "",
        "For instance, one youth shared that everyone felt uncomfortable with a session held near a butcher shop. The idea that one of the common values made them express their dissent hints at the fact that how individual values or identity contributes to collectivism. Building both individual and collective identities among members is essential to make identity in Youth Clubs more accessible. These identities encompass individuals\u2019 presence during club sessions as well as the socially distinguishable features of the club itself. Quoting from a research paper 1 by James D Pearson in 1999:",
        "",
        "> \u201cIn ordinary speech and most academic writing, \u2018identity\u2019 means either(a) a social category, defined by membership rules and allegedly characteristic attributes or expected behaviors, or(b) a socially distinguishing feature that a person takes special pride in or views as unchangeable but socially consequential (or, of course, both (a) and (b) at once).\u201d",
        "",
        "In rural areas, youth clubs use visual elements like murals/signages to foster belonging and togetherness among members. This image displays the Sifung Harimu Afad's visual identity, using text and colours to symbolize a collective identity.",
        "",
        "",
        "### Facilitating Individual And Collective Identity In Youth Clubs",
        "",
        "",
        "Earlier, I mentioned the need to build an identity that is both individualistic and collective. If I join a group but fail to form associations despite efforts, there is no collective. Even if I get along with everyone, I may still not align mentally with the group or its goals. For me, finding associations is crucial. I adopt practices of a new place when I find meaning in its rituals or feel comfortable in a space, whether surrounded by familiar or unfamiliar people.",
        "",
        "While many factors influence our choices, having agency in such spaces fosters bonding with the collective and supports individual interests. But how can we facilitate individual identity building? Since individual identity development is an internal process, external factors may or may not speed it up. Collective identity forms easily because spaces are built with specific agendas, making objectivity simpler than subjectivity. Erik Erikson\u2019s 2 stages of identity development, especially for youths, highlight how guided exploration can help them develop their identities. Targeted interventions to help them recognize their strengths and interests are beneficial for facilitating individual identity building.",
        "",
        "",
        "### Encouraging Dialogue And Reflection",
        "",
        "",
        "These spaces host activities that foster discussion, helping members reflect, recognize each other\u2019s potential, and learn collectively. These activities not only promote self-learning but also foster collective interests and objectives. An activity like &#8216;Origin Gatherers' encourages participants to think creatively and make connections based on limited information. When conducted in a youth club space, each member reflects individually on a discovery. The group then discusses it and develops a plausible or creative explanation for how it might have happened. Know more about these groups here.",
        "",
        "Another activity, &#8216;Desires vs. Values: Tug of War,&#8216; helps identify conflicts between personal desires and core values. It supports identity building while fostering collective goals through group discussions on individual values. The space should provide adequate opportunities for members to express their perspectives, often facilitated through structured dialogue sessions.",
        "",
        "Building on this, collective interests and objectives accelerate the process of individual identity building. After completing an activity, members form their perspectives if the learning objectives resonate with them, laying the foundation for their identities. However, with diverse identities in a single place, differing perspectives can often cause tension.",
        "",
        "",
        "### The Impact Of Group Membership On Identity",
        "",
        "",
        "Every member contributes to the collective through their presence, actions, and communication. What can lead to forming collective interests and objectives may not resonate with each member's perspective, making it challenging to establish a collective identity that aligns with everyone.",
        "",
        "When people join spaces based on certain ideas or agendas, new members often face difficulties. Even when members join willingly, openly challenging their perspectives can create friction, forming smaller groups within the larger space, which harms the collective.",
        "",
        "A person\u2019s sense of who they are is often influenced by their group memberships. Tajfel 3 argued that social identity\u2014the sense of belonging to a group\u2014contributes to self-esteem and shapes behaviours and attitudes toward others.",
        "",
        "",
        "### The Influence Of Physical Space On Identity",
        "",
        "",
        "Who defines the collective identity of a youth club? If the sense of self is continuously affected by the collective, forming a collective identity with evolving selves becomes challenging. However, the physical space remains constant in all of this.",
        "",
        "Connecting with the space\u2019s appearance, whether others are present or not, can create a sense of belonging. Group associations can then develop over time. Members can achieve association with the physical space through co-creation, incorporating various perspectives into every aspect of its design.",
        "",
        "Certain values drive the program. When diverse people share the space, what happens to its collective identity? Is it established when the space is created with a specific agenda, or does it evolve gradually as the space is used?",
        "",
        "Especially in purpose-driven spaces, collective identity should be more flexible. Letting members discuss their interpretations of pre-designated values can foster a more cohesive and adaptable collective identity. I have personally observed spaces slowly morph and adopt an identity over time, even if designated for specific requirements. The evolving nature of collective identity can provide a structure that adapts to individual growth, which can be beneficial in an environment where youth are exploring and redefining their sense of self.",
        "",
        "",
        "### References",
        "",
        "",
        "---",
        "*\u2014 Aditya Diundi*"
    ]
},
  "essays/Motivation_In_Rural_Leadership_Programs.md": {
    "id": "motivation_in_rural_leadership_programs",
    "path": "essays/Motivation_In_Rural_Leadership_Programs.md",
    "filename": "Motivation_In_Rural_Leadership_Programs.md",
    "title": "Motivation In Rural Leadership Programs",
    "category": "essays",
    "extension": "md",
    "lines": [
        "# Motivation In Rural Leadership Programs",
        "",
        "**Author:** Aditya Diundi  ",
        "**Publication:** India Fellow  ",
        "**Source Link:** [https://indiafellow.org/blog/all-posts/motivation-in-rural-leadership-programs/](https://indiafellow.org/blog/all-posts/motivation-in-rural-leadership-programs/)",
        "",
        "---",
        "",
        "What drives motivation in rural leadership programs, prompting people to sit in a temporary space with no ventilation during summers, with temperatures soaring up to 39 degrees, and still attend a 2-hour club session, sitting on a mat without chairs? I am talking about some of the folks who are part of Rural India Youth Leadership program. These spaces, or clubs, are run by a youth formally called a youth mobiliser, whose presence ensures the smooth running of these clubs. Each youth mobiliser manages two separate clubs in their respective panchayats.",
        "",
        "The members are youth volunteers, who engage in these clubs for a year, and through various activities, they learn leadership and active citizenship. Eventually, they form a network of 400 youths connected with external organisations and experts, participating in various engagements across these club spaces.",
        "",
        "",
        "### How The Clubs Operate",
        "",
        "",
        "Coming back to the question at the start of the blog. The motivation. What can it be? To understand the motivation behind this, it's essential to look at the system itself and how these club spaces function. Understanding the system behind these spaces is crucial to realising the motivation in rural leadership programs.",
        "",
        "> A Youth Mobiliser running these clubs is supported by Youth Coordinators, each of whom work with 4-5 Youth Mobilisers. Each Youth Mobiliser is responsible for two club spaces, facilitating bi-weekly meetings.",
        "",
        "The youth mobilisers plan sessions, share information, and collaborate, creating a network of knowledge exchange. The system fosters an environment of support, learning, and collective growth.",
        "",
        "",
        "### What Each Member Gives And Receives",
        "",
        "",
        "Here's a glimpse into what different members of this system give and take:",
        "",
        "These spaces are collectively chosen by the members. In some panchayats, there is a lack of comfortable areas, and hence, some of these clubs exist in spaces like the one mentioned at the start of this blog. But what can really motivate people to sit in uncomfortable spaces and still attend a 2-hour session?",
        "",
        "",
        "### Leadership, Belonging And Emotional Connections",
        "",
        "",
        "Is it because of the idea of leadership? The thought that they can become leaders of their own lives and, in turn, make their communities\u2019 lives easier?",
        "",
        "Or is it the fact that some actually enjoy spending time with other members? These clubs may offer a unique opportunity to be vulnerable, to share their fears, and to exchange more emotions than they do with their families or outside the club spaces. It\u2019s a place where they can just play one day and discuss serious topics like gender equality and inclusion on another.",
        "",
        "> Most sessions I\u2019ve observed made me wonder \u2013 why? Why are they sitting without complaining about the heat, while many of us in urban spaces struggle to function without air conditioning?",
        "",
        "For many, it seems the idea of togetherness is stronger than the discomfort of physical conditions. The way they perceive the space, how they see themselves being present there, and the emotional bonds they form affect their motivation and desire to return, week after week. We are deeply ingrained with how some spaces should be. When it comes to learning spaces everyone has different notions as well. How people perceive these spaces and how they see themselves being present in that space has a huge impact.",
        "",
        "",
        "### Ownership And Resilience In The Face Of Challenges",
        "",
        "",
        "Some may view broken tables in schools as a huge barrier to learning, but for these Youth Volunteers, dissatisfaction rarely stems from the physical environment. Their complaints, if any, are more about personal schedules clashing with the club sessions. Despite this, they express a strong sense of love for the club and the space itself. Many even say things like \u201c\u0939\u092e\u093e\u0930\u093e \u0915\u094d\u0932\u092c\u201d (our club) and \u201c\u092e\u0947\u0930\u093e \u0915\u094d\u0932\u092c\u201d (my club), showing how they\u2019ve developed a sense of ownership.",
        "",
        "During a recent visit, while piloting an activity from the Youth Resource Manual, a Youth Volunteer said to me: \u201c\u092d\u0948\u092f\u093e, \u0917\u0930\u094d\u092e\u0940 \u092c\u0939\u0941\u0924 \u0939\u0948, \u0906\u092a \u092a\u093e\u0928\u0940 \u092a\u0940 \u0932\u0940\u091c\u093f\u090f \u0914\u0930 \u092f\u0947 \u092a\u0902\u0916\u093e \u0907\u0938\u094d\u0924\u0947\u092e\u093e\u0932 \u0915\u0940\u091c\u093f\u090f\u0964 \u0939\u092e \u092c\u0939\u0941\u0924 \u0926\u0947\u0930 \u0938\u0947 \u092c\u0948\u0920\u0947 \u0939\u0948\u0902, \u090f\u0921\u091c\u0938\u094d\u091f \u0939\u094b \u0917\u090f \u0939\u0948\u0902\u0964\u201d (\u201cBhaiya, it\u2019s very hot. Please drink some water and use this fan. We\u2019ve been sitting for a long time and have adjusted.\u201d)",
        "",
        "During the visit, initially, I felt that the members would not be interested in the session because of the heat and would not pay attention to what I had to share. To my surprise however, the selflessness and then interest that they showed throughout the session made me think about how I function in spaces where I don\u2019t feel comfortable. Not just spaces but even people around whom I feel stressed.",
        "",
        "How can I learn from the volunteers and make sure that I also have at least a percentage of the resilience that these folks have? It's still a long way for me to go in this regard but this event definitely struck a chord in me.",
        "",
        "",
        "### Togetherness And Motivation In Rural Leadership Programs",
        "",
        "",
        "I still wonder what goes through their minds, and how they ensure their own learning in spaces that can hinder functioning. But one thing is clear: there is a profound sense of belonging and togetherness that overrides the challenges of the space. It creates a powerful connection, turning even the most uncomfortable spaces into something better than an air-conditioned room. The love for being part of something bigger and the desire to learn, grow, and share with others shine through.",
        "",
        "Perhaps, it\u2019s not just about leadership or emotional exchange, but the simple, powerful act of coming together in a space that feels like their own. This profound sense of togetherness is key to understanding\u00a0motivation in rural leadership programs.",
        "",
        "---",
        "*\u2014 Aditya Diundi*"
    ]
},
  "essays/Questions_For_Self_Discovery_From_A_Human_Process_Lab.md": {
    "id": "questions_for_self_discovery_from_a_human_process_lab",
    "path": "essays/Questions_For_Self_Discovery_From_A_Human_Process_Lab.md",
    "filename": "Questions_For_Self_Discovery_From_A_Human_Process_Lab.md",
    "title": "Questions For Self-Discovery From A Human Process Lab",
    "category": "essays",
    "extension": "md",
    "lines": [
        "# Questions For Self-Discovery From A Human Process Lab",
        "",
        "**Author:** Aditya Diundi  ",
        "**Publication:** India Fellow  ",
        "**Source Link:** [https://indiafellow.org/blog/all-posts/questions-for-self-discovery-from-a-human-process-lab/](https://indiafellow.org/blog/all-posts/questions-for-self-discovery-from-a-human-process-lab/)",
        "",
        "---",
        "",
        "During the Basic Human Process Lab at Indian Society For Applied Behaviour Science - ISABS, I encountered several profound questions for self-discovery. This 5-day program, held at Yatri Niwas, Sewagram, Wardha, was deeply introspective and provided a unique space for self-exploration. It offered insights into my behaviour, communication, and role in a larger system, allowing me to reflect on how I interact with others and navigate my environment.",
        "",
        "",
        "### Key Insights Gained",
        "",
        "",
        "Through various discussions, I realized the importance of self-awareness and open communication. These insights are essential for personal growth and effective community engagement. Understanding myself better equips me to engage with others authentically. The questions I share are a direct result of this process. They remain unanswered but are meant to provoke thoughts and feelings or feelings and thoughts.",
        "",
        "By contemplating these questions, we can embark on our own paths of self-discovery. I hope they resonate with you and inspire meaningful reflections.",
        "",
        "> Self-AwarenessAm I selectively sensible?What is my space?Do I genuinely want to help someone?Am I only confident about myself and not those who are around me?Am I present here, or am I just a function of the system whose existence is reliant on the existence of the system?What is good for me in collective good?Am I selectively sensitive?Is it bad to be dependent?Why is it tough for someone to encounter certain questions?Why do people call it confusion when it is their inhibitions?Is it fair for people to not get answers due to someone\u2019s inhibitions?Is it true that people who keep looping themselves in the same problem are doing it intentionally?Is it scary to be native?CommunicationWhy am I constantly refuted over what I share? Is it because I also constantly refute other people or their arguments?Am I genuinely uninterested in what others have to say?Do I consider what qualities or resources I possess that might encourage people to seek support from me?Am I approachable?Is there room for me to offer support?Interpersonal RelationshipsAm I able to identify those who are not able to recognize themselves?",
        "",
        "In conclusion, these questions are not just reflections of my journey but invitations for you to embark on your own path of self-discovery. The act of questioning can unlock deeper understanding and connection within ourselves and with others. If you're interested in specific areas, you can create your own reflection worksheets. Check out another blog on reflection worksheets for continuous learning for more questions and ideas. I hope these queries spark curiosity and inspire meaningful conversations in your life. What thoughts or questions resonate with you?",
        "",
        "---",
        "*\u2014 Aditya Diundi*"
    ]
},
  "essays/Youth_Masterpiece_Fostering_Collaboration_Through_Art.md": {
    "id": "youth_masterpiece_fostering_collaboration_through_art",
    "path": "essays/Youth_Masterpiece_Fostering_Collaboration_Through_Art.md",
    "filename": "Youth_Masterpiece_Fostering_Collaboration_Through_Art.md",
    "title": "Youth Masterpiece: Fostering Collaboration Through Art",
    "category": "essays",
    "extension": "md",
    "lines": [
        "# Youth Masterpiece: Fostering Collaboration Through Art",
        "",
        "**Author:** Aditya Diundi  ",
        "**Publication:** India Fellow  ",
        "**Source Link:** [https://indiafellow.org/blog/all-posts/youth-masterpiece-fostering-collaboration-through-art/](https://indiafellow.org/blog/all-posts/youth-masterpiece-fostering-collaboration-through-art/)",
        "",
        "---",
        "",
        "We\u2019re developing Midline Masterpiece as one of the many activities in the Youth Resource Manual (YRM), an added asset for the Rural India Youth Leadership Program. The objective of the activity was to enhance teamwork, collaboration, and communication skills among youth participants by creating a unified drawing while respecting individual boundaries. While the description explains the purpose, participants or observers best understand it through direct involvement. I\u2019ll be sharing some pictures to give you a better sense of what Midline Masterpiece it\u2019s all about.",
        "",
        "> \u201cAlright folks, time to get artsy! Who is ready to Picasso their way through this?\u201d",
        "",
        "> \u201cWhen two creative minds collide, anything can happen. Let the masterpiece making begin!\u201d",
        "",
        "> \"Every great work of art starts with a single line \u2026 or a scribble. We\u2019re not judging!\"",
        "",
        "> \u201cWho said the middle is off-limits? Let\u2019s make this a masterpiece mashup!\u201d",
        "",
        "> \u201cWhat\u2019s better than one idea? Two ideas battling for space on the same paper!\u201d",
        "",
        "> \u201cTa-da! The \u2018Midline Masterpiece\u2019 is complete. And yes, it\u2019s a collaborative chaos we love!\u201d",
        "",
        "> \u201cSo, whose side was better? Let the art critique commence!\u201d",
        "",
        "> \u201cSay \u2018cheese\u2019! Or \u2018crayons\u2019! Whichever gets the biggest smile!\u201d",
        "",
        "These pictures are from the first community trial, held a few days ago. We provided the activity to the youth mobilizer in the form of a document, without any additional support. Our goal was to evaluate whether the instructions were clear and self-explanatory enough for them to conduct the activity independently. While observing the activity, I realized that everything you'd expect in a collaborative effort played out during this simple 1-hour session. There was even some friction. The pair struggled to agree on what to draw. At the start, we had explained that while the goal was a unified drawing, it was perfectly fine for each person to express their own ideas separately on their half.",
        "",
        "The best part came during the reflection at the end. The conversations aligned with the learning objectives of Midline Masterpiece, which aims to foster teamwork and collaboration. At the same time, we gained insights into what could be improved to make the activity more accessible and understandable for everyone. To learn more about the work at my host Project Potential, and how we engage youth in multi-dimensional learning experiences, feel free to check out another blog!",
        "",
        "> Rural India Youth Leadership is a two-year experience for 25 young people who will be on a journey of leadership and learning that will enable them to form youth clubs and through the clubs, nurture 400+ grassroots youth leaders. RIYL program is designed and managed by Project Potential in Kishanganj district of Bihar.",
        "",
        "---",
        "*\u2014 Aditya Diundi*"
    ]
},
  "essays/Balancing_Act_Navigating_Choices_In_Rural_Rajasthans_Water_Crisis.md": {
    "id": "balancing_act_navigating_choices_in_rural_rajasthans_water_crisis",
    "path": "essays/Balancing_Act_Navigating_Choices_In_Rural_Rajasthans_Water_Crisis.md",
    "filename": "Balancing_Act_Navigating_Choices_In_Rural_Rajasthans_Water_Crisis.md",
    "title": "Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
    "category": "essays",
    "extension": "md",
    "lines": [
        "# Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
        "",
        "**Author:** Aditya Diundi  ",
        "**Publication:** India Fellow  ",
        "**Source Link:** [https://indiafellow.org/blog/all-posts/balancing-act-navigating-choices-in-rural-rajasthans-water-crisis/](https://indiafellow.org/blog/all-posts/balancing-act-navigating-choices-in-rural-rajasthans-water-crisis/)",
        "",
        "---",
        "",
        "Rural Rajasthan's water crisis is real. Believe me there are people who are only drinking a litre of water everyday. Barely managing their water needs amidst the face of crisis is the only option for some families of rural Rajasthan. I was on the outskirts of Jaipur with my field team exploring villages where Tarun Bharat Sangh operates and functions towards solving issues of extreme water crises along with the help of people facing the issues.",
        "",
        "There I met the husband of Manbhar Devi. One doesn't go and start asking a ton of questions and trouble people who are already living in distress. But my curiosity got the better of me. When I talked to him he explained that someone with access to clean drinking water for most of their life may get sick after taking a sip of the water that the rural Rajasthan's inhabitants for the past 30 years have been forced to use.",
        "",
        "The water crisis here is not a new problem and a lot of scientific research has also taken place quantifying the amount of water contamination, groundwater levels and the reasons for its depletion. These families living in the regions of rural Rajasthan on the outskirts of the capital city of Rajasthan, Jaipur have been facing water scarcity and contamination problems for a very long time now.",
        "",
        "",
        "### The Silent Struggle: Field Notes From A Crisis",
        "",
        "",
        "People living in villages under Kalwada, Bhamboriya and Nevta Panchayats, part of Saganer Tehsil of Jaipur, have been grappling with water scarcity for decades. They have adjusted their lives to the problems stemming from malpractices and dyeing industries, which have contributed to the present conditions. It is not just the local water sources which are heavily contaminated but the groundwater also has high fluoride concentration. In a research paper published in 2023, a maximum of 37 mg/l of fluoride concentration was reported in the groundwater in rural areas across Rajasthan1. Concentration of fluoride beyond 1.5 mg/L by either geogenic or anthropogenic means has been classified as fluoride pollution of groundwater (Shekhar, 2017).2",
        "",
        "This article aims to focus on the stories of resilience of the people living in these areas. After spending almost a month with these communities one begins to realise the importance of decentralised solutions they have devised.",
        "",
        "",
        "### Battling Contamination: Impact On Health And Livelihood",
        "",
        "",
        "The water crisis has impeded agricultural development in rural Rajasthan and the consumption of contaminated water for a long time has affected health, livelihood, family dynamics and everything else that revolves around it. The social fabric is tainted. There is a lot of frustration in the communities which directly stems from the issues around water.",
        "",
        "They don\u2019t have enough water to irrigate their farms and have consumed contaminated water for the past 30 years. This situation was entirely different 30 years ago when the rivers had clean water, and rainfall was sufficient for their agricultural practices. Man against nature was extremely prevalent in these areas, resulting in the current conditions. Daily lives impact water that exist around us. There is always a lack of water sewage disposal in villages.",
        "",
        "That combined with industrial affluents that have been adding to the overall contamination has made the situation of water scarcity even worse than before. Every family I came across during my visits had at least one bedridden member due to many years of consuming contaminated drinking water. Due to a lack of local water sources, people started installing borewells, which depleted the groundwater. As much as a borewell seems like a good solution to their drinking needs, the water they get from it is not potable due to high fluoride contamination.",
        "",
        "",
        "### Research on Fluoride",
        "",
        "",
        "The research on fluoride levels in groundwater in the areas of rural Rajasthan mentions the consequence of the geogenic origin of fluoride due to natural underground weathering processes. Excess amounts of fluoride ions in drinking water can cause dental fluorosis, skeletal fluorosis, arthritis, bone damage, osteoporosis, muscular damage, fatigue, joint-related problems, and chronicle issues.3 Many of these issues were observed during the I time spent around the community and a lot of information about these health issues were also gathered from local clinics mentioning the most common diseases to be kidney stones and joint pain.",
        "",
        "",
        "### Solutions On The Horizon: Initiatives By Tarun Bharat Sangh",
        "",
        "",
        "Working with Tarun Bharat Sangh, I had an opportunity to do a case study on ten families living in Kalwada, Bhamboriya and Nevta Panchayat who got farm pond and water tanks4 built for themselves through the joint initiative of Tarun Bharat Sangh and its CSR partner Mahindra World City, Jaipur.",
        "",
        "",
        "### The Dilemma Of Choice: Farm Ponds vs. Water Tanks",
        "",
        "",
        "We visited the house of Manbhar Devi, who had her Water Tank built through the collaborative model of Tarun Bharat Sangh. In this collaborative process some parts like providing construction materials are handled by the organisation and people contribute in the form of voluntary labour (shram daan) getting the ground excavated. The percentage division of work is either 25-70 in the case of a water tank and 50-50 in the case of a farm pond.",
        "",
        "The people contribute either monetarily for digging the ground and labor costs, or through voluntary labor, where family members work on the sites themselves. Manbhar Devi's husband Bhairu Lal offered us water. The mug he gave us had fluoride deposits in it. He said with a straight face, \"do ghoont paani pi lo, shaam tak dast lag javla\" (take two sips, enough to give you diarrhoea)",
        "",
        "His words highlights the scale of the problem faced by not just his family but also numerous others residing in villages under Kalwada Panchayat, a prime example of rural Rajasthan's water crisis.",
        "",
        "",
        "### Individual Struggles: Personal Narratives",
        "",
        "",
        "Prem Devi, residing in a village named Bairwon ki Dhani in Kalwada Panchayat, single-handedly supports her family by raising goats. She also owns 12 bigha of land that remains arid due to irregular rainfall patterns and contaminated local water sources. Her husband died 25 years ago, thereby leaving her to take care of four young kids, a son and three daughters. After this, Prem Devi had to do everything alone. From farming her land and taking care of her children to enduring the struggles that come with agriculture.",
        "",
        "This region has severe water scarcity issues as well. Some years would be good in comparison to others if it would rain. However, cultivating land, relying on irregular rainfall, facing risks around farming different crop types, and then managing her family all alone .Last year, she incurred heavy losses due to her crops not maturing properly. This was a direct consequence of the lack of local water sources for irrigation, inadequate rainfall, and high temperatures in the region.",
        "",
        "When asked what she could produce in the past before the construction of her farm pond, she replied, \"2-5 bori bajra toh uga levan cha, chokhi baarish ho jave toh 15 bhi ho jave chh\" (even with little rainfall, I could harvest 2-5 bags of bajra, but with good rainfall, it could go up to 15 bags). This was only from a small part of her farmland that she could irrigate. Ideally, if she gets enough water to cultivate 12 bigha of her farmland, at full efficiency, it can produce around 50-55 bags (each bag is 100 kg) of farm produce which also generates fodder. In such a scenario, Prem Devi can multiply her family income manifold if only she could transform the barren land, which is not cultivable.",
        "",
        "",
        "### Challenges And Adaptations",
        "",
        "",
        "Prem Devi and her family had adjusted to the problems they faced in rural Rajasthan's water crisis, however after getting a farm pond, she can now utilise all three cropping seasons to increase her annual income, but she and her family still consume contaminated drinking water which she hopes will now stop once she starts making more money from farming and utilising extra profits for good quality of water which she can order from local water suppliers.",
        "",
        "",
        "### Observing Resource Allocation",
        "",
        "",
        "Many families in and around the three panchayats mentioned initially are opting for both a water tank and a farm pond. Talk about economic diversity which appears to be more prominent in cities however here in these panchayats one can visually identify who is more privileged than the other, just by the resources. A good idea about resource allocation and sharing can be grasped from multiple stories from the communities.I came across one such community through India Fellow's social leadership program. Good thing is that a lot of such stories are published at a single platform which all of us can refer to while thinking about our society in general.",
        "",
        "Now let's quickly get back to the original idea of this blog which is about rural Rajasthan's water crisis and the three panchayats that I visited.The sarpanch of Bhamboriya had a model size farm pond built for himself, boasting such a huge volume that once filled, it can easily last multiple agricultural seasons without relying on rainfall for refilling.",
        "",
        "",
        "### Analyzing Community Dynamics",
        "",
        "",
        "Now whether the sarpanch is going to share this resource with the neighbouring small-scale farmers is a question I have not asked. However I do remember the story which Prem Lal of Bairwon Ki Dani told me. Bairwon Ki Dani is the same village where Prem Devi lives who also happens to be Prem Lal's neighbour. Prem Devi and Prem Lal are part of the &#8216;Bairawa' community which lives in this village and belongs to the scheduled caste.",
        "",
        "> Prem Lal told me about this time a few years back there was an acute shortage of drinking water. None of the neighbouring villages would offer help to the people of Bairwon ki Dani. At that time, women from this village gathered together, pooled the money, whatever they could manage and ordered water tankers for the entire community.",
        "",
        "Whether such collaboration and pooling of resources is possible when it comes to getting a farm pond as a local water source for multiple farmer families is a question of scale but at least some communities do tend towards resource sharing during extreme adversities whereas some would stick to their closed groups and keep their resources central towards their utilities amidst the massive water crisis.",
        "",
        "",
        "### Coping Mechanisms: Seeking Solutions",
        "",
        "",
        "For Durga Lal who lives in Ganatpura, another village in Kalwada Panchayat, getting a water tank was of primary concern because of his two young sons and a one-year-old granddaughter. Durga Lal\u2019s father is bedridden and has been suffering from severe itching for the last 20 years. He doesn\u2019t want other members of his family to develop similar medical conditions hence he opts for a water tank, compromising his livelihood position.",
        "",
        "",
        "### Conclusion: Reflecting On The Journey",
        "",
        "",
        "These people have limited livelihood options where most work as informal labourers or on farms. Some farmers sold their land as land prices in the Kalwada region are very high with a bigha fetching as much as Rs 3 crores. However, they have lived with these problems for so long now that they sound so casual while explaining the same. They have compromised with their situation and have been consuming the same contaminated water for the last thirty years.",
        "",
        "The explanation alone doesn't fully convey the severity of their problems unless one experiences them firsthand. Simply visiting and tasting the water they consume for a day might not result in immediate sickness. But it can help highlight the underlying cause of all the health issues in these villages.",
        "",
        "In an area where people face water issues that impede their agriculture and putrefy their bodies, the question of whether one would opt for a farm pond for agriculture and keep consuming contaminated water or get a water tank built and rely on irregular rainfall presents a challenging predicament. How they navigate these extreme challenges remains a question for contemplation, yet understanding them fully seems elusive.",
        "",
        "---",
        "*\u2014 Aditya Diundi*"
    ]
},
  "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt": {
    id: "tasveerein",
    path: "poetry/तस्वीरें_छोटी_होनी_चाहिए.txt",
    filename: "तस्वीरें_छोटी_होनी_चाहिए.txt",
    title: "तस्वीरें छोटी होनी चाहिए",
    category: "poetry",
    extension: "txt",
    lines: [
      "// कविता: तस्वीरें छोटी होनी चाहिए",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/3499/ (20 May, 2026)",
      "",
      "तस्वीरें छोटी होनी चाहिए,",
      "लोग पास आकर देखते हैं।",
      "",
      "दूर से तो चाँद भी दिखता है,",
      "पर उसका रोज़ थोड़ी सोचते हैं।",
      "",
      "वो बड़ा है,",
      "यूँ ही खड़ा है,",
      "उसे ख़ास थोड़ी समझते हैं।",
      "",
      "वो तस्वीर जो छोटी होती है,",
      "उसमें तुझे खोजते हैं।",
      "",
      "मेरी एक तस्वीर बनाना,",
      "उसमें छोटी-सी एक लकीर बनाना।",
      "",
      "लकीर के इस तरफ़ मुझे बनाना,",
      "और उस तरफ़ रखना ज़माना।",
      "",
      "— आदित्य",
    ],
  },
  "poetry/गंजे_लोगों_की_पंचायत.txt": {
    id: "panchayat",
    path: "poetry/गंजे_लोगों_की_पंचायत.txt",
    filename: "गंजे_लोगों_की_पंचायत.txt",
    title: "गंजे लोगों की पंचायत",
    category: "poetry",
    extension: "txt",
    lines: [
      "// व्यंग्य-कविता: गंजे लोगों की पंचायत",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/6075/ (28 Mar, 2026)",
      "",
      "लोग बात बहुत करते हैं,",
      "मौका मिलते ही",
      "बातें चालू।",
      "",
      "काम का बना दिया है हलवा,",
      "और बातों का है असीम जलवा।",
      "",
      "मुद्दा सामने ही था,",
      "लेकिन पहले ज़रा किस्से-कहानी हो जाए।",
      "",
      "जाओ किसी कॉन्फ़्रेंस में — ज्ञान बहुत देंगे,",
      "जो नहीं आते ऐसी बैठकों में",
      "वो बहुत कम मिलेंगे।",
      "",
      "अरे, पर बातें भी तो ज़रूरी हैं,",
      "हम नहीं करेंगे तो कौन करेगा?",
      "",
      "जिनकी बातें हैं, वो करेंगे —",
      "एक नहीं, कई हज़ार हैं,",
      "और ना वैसा मंच है,",
      "ना उनके लिए कोई बाज़ार है।",
      "",
      "ग़रीब गंजा ही रह जाता है,",
      "अमीर बुढ़ापे में भी नए बाल लगवाता है।",
      "",
      "मैं भी बातें बहुत करता हूँ —",
      "काम, उससे भी कम।",
      "बाल मेरे भी नहीं हैं,",
      "और मिज़ाज सूरज से भी गरम।",
      "",
      "— आदित्य",
    ],
  },
  "poetry/नहीं_बुलाना.txt": {
    id: "nahi-bulana",
    path: "poetry/नहीं_बुलाना.txt",
    filename: "नहीं_बुलाना.txt",
    title: "नहीं बुलाना",
    category: "poetry",
    extension: "txt",
    lines: [
      "// कविता: नहीं बुलाना",
      "// रचनाकार: आदित्य दियुंडी",
      "// स्रोत: diundi.bearblog.dev/1925/ (03 Jun, 2026)",
      "",
      "किसे बुलाना कहाँ बुलाना,",
      "कोई रुपया कोई आना।",
      "किसे बुलाना क्यों बुलाना,",
      "उसने अब नहीं आना।",
      "",
      "इधर हुआ जो उधर कहाँ है?",
      "नीचे क्यों ये आसमान है?",
      "शौक गया है सांस गयी है,",
      "मन की आवाज गयी है।",
      "",
      "किसे बताना क्यों बताना,",
      "सब सही जब यही सुनाना।",
      "उधर की बातें नहीं बताना,",
      "इधर नहीं हुआ जब आना।",
      "",
      "धीमे धीमे यूंही रोजाना,",
      "वक्त कटे दिन घटे,",
      "दर्द जब नहीं बंटे,",
      "कल शायद आसमान हटे।",
      "",
      "धीरे धीरे थम गया,",
      "वक्त सारा कहाँ गया?",
      "ना जाने कब ये आसमान हटेगा,",
      "दर्द मेरा कब घटेगा?",
      "",
      "इसलिए अब नहीं बुलाना,",
      "नहीं बुलाना, नहीं बुलाना।",
      "",
      "— आदित्य",
    ],
  },
  "poetry/The_Fire_I_Watered.md": {
    id: "fire-watered",
    path: "poetry/The_Fire_I_Watered.md",
    filename: "The_Fire_I_Watered.md",
    title: "The Fire I Watered",
    category: "poetry",
    extension: "md",
    lines: [
      "# The Fire I Watered",
      "",
      "*Date: 27 Mar, 2026*",
      "*Author: Aditya Diundi*",
      "*Source: diundi.bearblog.dev/the-fire-i-watered/*",
      "",
      "---",
      "",
      "I knew fire when I was a child.",
      "I watered it as I grew.",
      "I became smoke which disappeared.",
      "I for once would want a few more years",
      "Of the childhood which had fire,",
      "For the fire which I watered,",
      "For the smoke to reappear.",
      "I wish for it all again.",
      "I yearn for it to happen exactly as it did.",
      "For the fun was in the cycle.",
      "I wish to be hidden within.",
      "",
      "— Aditya",
    ],
  },
};

export const ArchiveReader: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const [archiveMap, setArchiveMap] = useState<Record<string, ArchiveItem>>(FALLBACK_ARCHIVE_DATA);
  const [selectedFile, setSelectedFile] = useState<string>("essays/Daughters_of_Misogyny.md");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    essays: true,
    poetry: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchContentFromApi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const newMap: Record<string, ArchiveItem> = {};
          data.items.forEach((item: ArchiveItem) => {
            newMap[item.path] = item;
          });
          setArchiveMap(newMap);
          // Auto-select first item if current selection not present
          if (!newMap[selectedFile] && data.items[0]) {
            setSelectedFile(data.items[0].path);
          }
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentFromApi();
  }, []);

  const toggleFolder = (folder: string) => {
    playClickChime(420);
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const currentItem =
    archiveMap[selectedFile] ||
    Object.values(archiveMap)[0] ||
    FALLBACK_ARCHIVE_DATA["essays/Daughters_of_Misogyny.md"];

  const categories = Array.from(new Set(Object.values(archiveMap).map((i) => i.category)));

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full select-text font-mono text-xs overflow-hidden"
    >
      {/* Nano/Vim top buffer tabs */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-7 border-b flex items-center justify-between px-3 text-[11px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <span
            style={{
              backgroundColor: `${activeTheme.accent}20`,
              color: activeTheme.accent,
            }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
          >
            VIM
          </span>
          <span className="font-semibold truncate">
            {currentItem.path}
          </span>
          <span style={{ color: activeTheme.textMuted }}>[RO]</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchContentFromApi}
            title="Reload content from content/ folder"
            style={{ color: activeTheme.accent }}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity text-[10px]"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">SYNC FOLDER</span>
          </button>

          <div style={{ color: activeTheme.textMuted }} className="hidden sm:flex items-center gap-3 text-[10px]">
            <span>utf-8</span>
            <span>markdown/txt</span>
            <span>lines: {currentItem.lines.length}</span>
          </div>
        </div>
      </div>

      {/* Main 2-column flexbox */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Directory Tree (Nvim Tree style) */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="w-56 md:w-64 border-r flex flex-col flex-shrink-0 select-none"
        >
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="px-3 py-2 text-[10px] uppercase font-bold border-b flex items-center justify-between"
          >
            <span>EXPLORER // CONTENT</span>
            <Code2 className="w-3 h-3" />
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {categories.map((cat) => {
              const catItems = Object.values(archiveMap).filter((i) => i.category === cat);
              const isFolderOpen = openFolders[cat] ?? true;
              return (
                <div key={cat}>
                  <button
                    type="button"
                    onClick={() => toggleFolder(cat)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-left transition-colors"
                  >
                    {isFolderOpen ? (
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    ) : (
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-xs">{cat}/</span>
                  </button>

                  {isFolderOpen && (
                    <div
                      style={{ borderColor: activeTheme.headerBorder }}
                      className="ml-4 mt-0.5 space-y-0.5 border-l pl-1.5"
                    >
                      {catItems.map((item) => {
                        const isSelected = selectedFile === item.path;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              playClickChime(500);
                              setSelectedFile(item.path);
                            }}
                            style={{
                              backgroundColor: isSelected ? `${activeTheme.accent}25` : "transparent",
                              borderColor: isSelected ? activeTheme.accent : "transparent",
                              color: isSelected ? activeTheme.accent : activeTheme.textPrimary,
                            }}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-xs transition-colors truncate border ${
                              isSelected ? "font-semibold" : "hover:bg-white/5 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <FileText
                              className="w-3 h-3 flex-shrink-0"
                              style={{ color: isSelected ? activeTheme.accent : activeTheme.textMuted }}
                            />
                            <span className="truncate">{item.filename}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* GitHub Instruction footer */}
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="p-2.5 border-t text-[10px] space-y-1"
          >
            <div className="flex items-center justify-between font-bold">
              <span>{Object.keys(archiveMap).length} items indexed</span>
              <FolderPlus className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="opacity-70 text-[9px] leading-tight">
              Curated essays, reflections, and poetry archives by Aditya Diundi.
            </p>
          </div>
        </div>

        {/* Right Column: Syntax-highlighted text reader with line numbers gutter */}
        <div
          style={{
            backgroundColor: activeTheme.windowBg,
          }}
          className="flex-1 overflow-auto p-4 flex font-mono leading-relaxed"
        >
          {/* Gutter with line numbers */}
          <div
            style={{
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textMuted,
            }}
            className="flex flex-col text-right pr-4 select-none opacity-50 border-r flex-shrink-0"
          >
            {currentItem.lines.map((_, i) => (
              <span key={i} className="leading-6 text-[11px]">
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Reader text body */}
          <div className="pl-4 flex-1 text-[13px] leading-6 overflow-x-auto" style={{ color: activeTheme.textPrimary }}>
            {currentItem.lines.map((line, idx) => {
              if (line.startsWith("# ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.accent }} className="font-bold text-base my-1">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("> ")) {
                return (
                  <div
                    key={idx}
                    style={{ borderColor: activeTheme.accent }}
                    className="italic text-amber-300 pl-2 border-l-2 my-1 opacity-90"
                  >
                    {line}
                  </div>
                );
              }
              if (line.startsWith("// ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.textMuted }} className="italic">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("---")) {
                return (
                  <div key={idx} style={{ borderColor: activeTheme.headerBorder }} className="border-b my-2"></div>
                );
              }
              if (line.startsWith("— ")) {
                return (
                  <div key={idx} style={{ color: activeTheme.accent }} className="font-semibold mt-3">
                    {line}
                  </div>
                );
              }
              return (
                <div key={idx} className={line.trim() === "" ? "h-4" : ""}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vim bottom statusline */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-6 border-t flex items-center justify-between px-3 text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: activeTheme.accent,
              color: activeTheme.isDark ? "#000" : "#fff",
            }}
            className="px-1.5 py-0.2 rounded font-bold uppercase"
          >
            NORMAL
          </span>
          <span className="font-semibold truncate">
            {currentItem.title}
          </span>
        </div>
        <div style={{ color: activeTheme.textMuted }} className="flex items-center gap-4">
          <span>unix</span>
          <span>utf-8</span>
          <span>100% ☰ {currentItem.lines.length}/L</span>
        </div>
      </div>
    </div>
  );
};
