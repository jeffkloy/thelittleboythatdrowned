// Embedded poem data to avoid CORS issues when loading from file system
const POEMS_DATA = {
EOF < /dev/null  "11 Moments From Love": `
# “11 Moments From Love”

When they ask, “What did you want from her?”, I’ll know what my answer will be.

1. I want to wake up next to her every morning and ask her what her dreams were about.
2. I want to make breakfast in bed, and then make her go to the kitchen because we shouldn’t eat in bed.
3. I want to make her tea just the way she likes it.

Two sugars, a dash of milk, and nothing less.
1. I want to kiss her goodbye every morning and wish her the best day at work.
2. I want to come home to her every afternoon and listen to how her day was, and learn how she felt when this and that happened at the office.
3. I want to curl up with her on the sofa as we put on our favourite show, even though we’ve seen it 5 times already.
4. I want to take her out to dinner in places we have only heard about but never tried before. She could have any appetizer and any course, and the only judgement I would pass is if she didn’t get her favourite dessert after.
5. I want to take her travelling across the seas and stand with her on the top of the tallest tower in an obscure European city, and breathe in deeply before we yell, “It’s you and me against the world.”
6. I want to hold her hand when she’s sad and tell her that everything eventually goes back to being okay, and that’s not a lie.
7. I want to walk with her through the park in silence, because we’re so comfortable with each other that we don’t have to always talk.
8. I want to hug her, like, really hug her time and time again, enjoying each embrace like it was our last.

I don’t want to be a memory.
I don’t want to be an option passed up.
I want to be chosen, just once.
Because I’d choose her any day.
`,
  "Attention": `
# “Attention”

# P# oem - “Attention”

I want your life to be important to me
I want to know about your day, your favourite things,
what you’re passionate about
I want to know these things every day

But I want to know you for more than that
I want to know what turns you on,
what makes you want to lay in bed with a man,
what makes you completely wet
I want to know these things every night
They say it takes two to tango
Will you ask me the same?
Will you care for me as well?
Or am I just somewhere you go to get some attention?

At which point can I learn about your childhood?
At which point can I break down while you hold me?
`,
  "Big Plans": `
# “Big Plans”

Why can’t I be in your big plans?
You were my good days, was I not yours?
`,
  "California": `
# “California”

Humboldt was the first time I had an out-of-body experience;
It was a cloudy day
We were at a town square and someone handed me free weed cake
Why would I say no?
I spent the night in the forest with my head in space, higher than the clouds could ever reach, farther than any human touch, more distant than anywhere my love would ever be waiting for me to come home
I landed back on Earth and nothing changed
Everyone was the same
Everything was the same
Space travel as a farce

San Francisco was the first time I was able to admit I had a polysubstance addiction;
It was when I was on the phone with her
She asked me if I was sober
I would never dare lie to her
I took a bunch of street pills an hour before
Weed to calm me down
Amphetamine to balance it out
I sat on my bed feeling so poorly that I disappointed her
All I wanted was to be her world
I couldn’t even be present in my own

Santa Monica was the first time I banned myself from going to the beach;
The pier at nighttime was nearly empty
All I could hear are the waves
Crashing into the shoreline
I reach the fisherman’s’ refuge
The moon shined down onto the water
Such a beautiful way to die
I wonder if Virginia needed a friend
Such a burning of the insides
But LA didn’t need another washed up boy
And I can see her some other time

Pasadena was the first time I came to realize I’ve made it as an adult,
but West Covina was the first time I really felt at home;
Stuffed animals surround me
My mom cooking grilled cheese at 3 AM
The earthquake that shoved us across the room
My mom never let me fall out of her arms
The first time I fell in love at 12
The 8 times I tried to kill myself at 13
The way I found my best friends
Illegal campfires in the hills
The way I held her hand as we looked over the city
We ran from the police so many times
The funny way they found me out at 18
The big time I tried to kill myself at 20
My first rehab
The only time I tried to pick up a townie hooker and found out she went to school with me so I couldn’t go through with it
My parents at 75
My parents at 85
My parents at 95
I can be gone most my life
but home is there forever
`,
  "Closer": `
# “Closer”

To bond over shared beliefs
That turned into shared truths
The revolutionaries in us just wanted
A better life for ourselves
A better life for others

Close to your beers
You threw your anger out over everything
From our room to the street
From the river to the sea

Close to your fears
You couldn’t trust anyone
And I wanted so badly to be your safe space
To be your sacred heart, your one and only

But you loved me, yet longed for someone else
And he consumed all of your thoughts
And he consumed all of mine
About you

I swear we tried, but we broke apart
You said you don’t give up on the souls you love
So I guess I wasn’t loved, or I wasn’t a soul
But I swear we tried, and I

I broke apart
Infantilised, inadequate, inherently alone
Once again, I am just the little boy that drowned
`,
  "Coffee": `
# “Coffee”

Coffee is great and everything…

But have you even woken up to the turning over to your side to give you a forehead kiss and wish you a great day?
`,
  "Conversations": `
# “Conversations”

A friend that thinks they know you:
Hi again
I’m glad we met
How are you?
No, how are you, really?
What do you mean?
Why are there bottles on the floor?
Did you remember to take your meds?
Please take your meds

A lover that didn’t expect your impulsivity:
Hey there
Where are you?
Sounds amazing! Did you plan this long ago? You never told me about it
What do you mean, you don’t know how you’re going to get back?
Do you need me to come get you?
Why did you go if you didn’t know how you’d survive?
Did you remember to take your meds?

A fight about nothing:
Hey
What’s up?
I’m sorry???
What did I do???
Can you calm down???
I can’t understand why you’re so mad
Please stop yelling!!!
I’m going to hang up now. No, not until you calm down
Goodbye

15 minutes before the sirens:
Hey
Can we talk?
I’m sorry, I don’t think I can handle “us” anymore
You’re just too much and it’s draining
I’m sorry
There’s nothing you can do
I’m sorry
Look, I just don’t think we’re right for each other
I have to go
Please don’t hurt yourself
`,
  "Delivered Read": `
# “Delivered / Read”

They say that:
  If you are important to someone
  They will make time for you
  No excuses, no lies, no broken promises
That hit different that morning

But I didn’t know how to tell her that
Without her thinking that I was clingy,
or, in the depths of love for her;
which I wasn’t

I just got tired of never being important enough to have the chance to be chosen
`,
  "Did You Say I Love You": `
# “Did You Say I Love You?”

Did you just tell him “I love you”? ‘cause that’s what I heard. Can I tell you something important?

They couldn’t feel it.
`,
  "Don’t Let Me": `
# “Don’t Let Me”
Don’t let me fall in love with you. Once I’m in love, it’s hard to stop how much I care, how loyal I am, how dedicated I can be, and how much adoration I show. It’s going to hurt me more than it it’ll be annoying to you.
`,
  "Drone Days": `
# “Drone Days”

Some days, depression hits me like a train the moment I wake up
It’s always bad dream after bad dream
Usually I dream about someone I adore having sex with someone else, and I can’t open the door to confront them, or else it’s the typical dream about rejection
I wake up sweating, but the weight of my brain makes it impossible to shower
Why shower?, I’ve never felt cleaner after anyway

I take my medication just to be safe
I don’t take it because I should, only because I have to - or else the day will be me curling up on the couch, falling asleep, and having the same bad dreams; or, me posting every thought I have onto social media; or, me contemplating how I can off myself for real this time
Who am I kidding?, I’m going to lay on the couch anyway, feel numb, and scroll through social media until I fall asleep
I need to eat
Since childhood, I’ve been banned from using the stove so I only somewhat learned how to cook; everyone was afraid I’d burn myself or the house down intentionally
I order in
$25 for something only worth a third of the price; all of the day’s budget
I get to work, automate myself out of a job, and let the hours pass

Nighttime comes
I’m scared again
Are there drugs laying around? No? Good
Are there beers in the fridge? No? Good
No one notices until I post 10 stories onto social media
I always expect the messages to flood in, from anyone,
But seldom do they ever do

Eventually I pass out from, once again, laying on the couch
I *get to* repeat this tomorrow
`,
  "Drugs": `
# “Drugs”

An exhale of smoke
   A few milliseconds of confusion
Two hours of bliss
   I can live here without you

It’s when I get sober
   does it feel bad
I didn’t notice the mess I created
Until I think I pawned our life away
   Your life, sorry

Blue sky, birds, the smell of croissants
   I am waking up for the first time in ages
   In a gutter on the street
Guess I’ve been out of it
`,
  "Eating Starlight": `
# “Eating Starlight”

# Poem # - # “# Eating # S# tarlight# ”# 

The first time I saw her,

I wanted to mess around and have some fun

The second time I saw her,

I wanted to continue having our first conversation

The third time I saw her,

I wanted to say “hello” by giving her a really meaningful hug

And every time after,

I wanted to eat starlight for eternity

What does starlight taste like?
Imagine chewing into a million Starburst candies

Times that by the peak of a weed high

Times that again by pi

It’s the moment you open the door and your heart flutters
When she walks in, everything in time just stops

You are so proud that she’s yours

You finally feel like yourself

It’s the moment you both lay your head down the first time
you’re not having sex

When she gently lays her head onto your pillow,
pushing up on your side

And you can smell the scent of her hair
You put your arm around her,

Everything in time just stops

It’s the moment you’re both out on your first trip

To somewhere you’ve both never been
But it already feels like your favourite city

As if every nook and cranny was now a comfortable surprise

The taste of the foods she places onto your tongue
The liquor that got you both up dancing in the middle of the square

It’s the moment you find out that you’re having a baby
From both your bloodlines; you’re going to be so proud of it

You’re going to kiss your lover every day until this baby comes out

You’re going to kiss your child every day til it hates you

But right now, it’s smiles all around

It’s the moment you’re at her hospital bed

Kidney cancer, stage 4
The doctor comes in and tells you that she only has a few weeks left
But it hurts too much to get up and out

You ask if there’s anything you can do,

and you hold on

Remember how we times’d Starbursts and weed highs by pi?
We times’d it by pi, because we still don’t
have a clue

what it truly feels like

when it all eventually ends

`,
  "Hard": `
# “Hard”

It’s been hard
Hard like my sympathy punches the wall
The wall doesn’t respond to me
I shout from the top of my lungs
But I don’t say a thing

It’s been hard, really
Hard like a trembling “I really want to be with you”
Hard like “You’re such a good person, I’m sure you’ll find someone”
Society doesn’t respond to me
I shed my emotions freely like the depths of oceans
But I’m parched as all hell

I search for some form of solace across the planet
I’m scared of feeling broken again
So I blacken my lungs and drown my sorrows
I’m scared of becoming an addict again

Trees, birds, door, couch, pills
Pills
It’s been hard
`,
  "Lovable": `
# “Lovable”

I think God messed up with everyone else

See, I was born with several disorders, so I look different than everyone and I grew up to be nobody’s type
See, God also gave me a troubled mind, and a heart I, one day, hope would grow so huge that it could capture the warmth of the sun and turn it into happiness for anyone who becomes afraid every time it goes down

See, no, I don’t think He made me unloveable

He made other people unable to love me

See, I’d love anyone
Just as if they already loved
Me a million times over
`,
  "North Star": `
# “North Star”

when your search is over
and you’ve finally found your soulmate
may you turn into the brightest star
any of us have ever seen
`,
  "On The Road": `
# “On The Road”

I haven’t showered in 2 days, and we’re driving 400 miles. I’m feeling great, because I get to spend all this time with you. I don’t stink yet; actually, i feel clean, because I smell like you, and I don’t ever want to wash this away.
`,
  "Our Truest Intentions": `
# “Our Truest Intentions”

Why do we hold onto each other?
You to my painful messages
And me to a hope that one day we’ll be true again

So damn my purest intentions
I only learned how to love
With a whole heart and not just by desire
You only learned how to love
By way of a broken childhood set alight with fire

Run me through the most unruly of machines
For I’ve a wish to incinerate my feelings
Because I always dreamt the best for you
But your best was directions for giving up

I thought you were my North Star
But you’re as putrid as a black hole
And this promise I made to you
The one where I’d never leave you behind
Is now a faded out road sign
Pointing us to dead ends

To the fake ones that never stuck with you through the turmoil of what we’ve built together
Why did you even once accept me at all?
Only to lose the truest of trues
Colouring me the bluest of blues
`,
  "Searching": `
# “Searching”

and I hope you are
looking for someone who
doesn’t just say,
“I love you”,
but for someone to give you
the world they’re building
`,
  "Sick": `
# “Sick”

I feel sick
I always feel sick
Why do I always feel sick?

I wish there was
Someone for me
So I can feel sick
Not sick *alone*

`,
  "Song": `
# “Song”

I thought I could’ve loved us forever
But I am just an illness you can’t vibe with

Ten years on and I still feel the numbness
From when I slipped and fell into oblivion
You never came to my rescue and all I wanted was a saviour
Not for forever, just for that day

God’s pledge of peace
Not hurting anyone but myself
The pills said more than I ever did in church
The good ones keep me together
But it takes the bad ones to fill this river
When all I needed was a seat at the docks

But I can’t get you out of my head
It’s like you’ve died and I’m stuck in this grief
A forever longing to be back in your bed
The only thing now is my empty body in between these bloodied sheets
`,
  "Spark and Calm": `
# “Spark and Calm”

and I wish
in this whole wide world
that you will find someone
who sparks your excitement
and calms your storms

but if I can’t see you
with anyone else
I wish you will find me
so I could be
your greatest surprise
`,
  "Ten Years": `
# “Ten Years”

We met in your favourite city
The city that’s so nice they named it twice
You were so nice to me, I think
I felt comfortable for once in someone else’s presence

I miss our late night phone calls
And I miss the way I could poke fun of you and you knew I meant no harm
And how you’d ask me for my opinion on everything
And you’d invite me to your work
And you’d invite me to all your outings
I never knew you were leading me on
And never wanted me the way I wanted you

I should’ve died that night
That bottle of pills seemed forgiving
What was it forgiving me for?
Why can’t I get you out of my head?
You’re so beautiful

I stopped doing drugs for both of us
You stopped talking to me because I called you a cunt
And I only did that because you got a boyfriend
And I only did that because you stopped calling me or inviting me out every day
I apologized for years

I apologized the first year
I apologized the third year
I apologized the fifth year

We finally became friends again
I thought my world was in repair
I thought the universe placed you back for a reason
Perhaps so I could hold you

You stopped talking to me again
I don’t know why
`,
  "The Endless Laughter": `
# “The Endless Laughter”
Some days I want to find love,
because there’s nothing greater to me than
having endless laughter and someone to hold.
But then I look back at everyone in pain,
a pain I already have these days,
when I think everyone hates me,
and nothing I could do
would make it better.
Some days I feel like I am the inside joke,
the endless laughter.
`,
  "Therapy": `
# “Therapy”

I walked to the clinic on 15th St
Sat down next to the fish tank
Lauren calls me in to her office
Ten minutes later than my appointment

She asks me to sit down
It’s not in my usual place
Why am I by the door?
Lauren asks me “Has anyone in your life told you that you’re too much to handle?”
I say yes
I mean, why would I lie?
She places the box of tissues next to me
I don’t understand

“I spoke with my supervisory board and we want to provide the best care for you, but we’re unable to provide you with what you need here”

I walk out onto the street
It’s getting cold this autumn day
She was therapist #7
I’m never going to get better
`,
  "to only be worth another's heart": `
# “to only be worth another's heart”

i feel too much, and every time it gets bad, i tell my friends and family that they don't need to worry about me so much,
or pay attention to the songs i share with them,   and that i could never expect them to save me; i know they can’t, and they'll kill themselves on the inside trying; but honestly, when i get so low and feel so broken, i just want to scream so loud that it is a shot heard across the world and cry so much that all of my insides dry out,*but i really just want to be loved and to be in loved with.*

i remind my mother that she can be there for me all of her life, but she can't expect that when she's gone or passed away that things won't get so hard for me again, and she'll never be able to save me from afar or from heaven, and i'd more than likely not die from natural causes, but from a painful doing of my own self.

i don't think anyone who doesn't have borderline or a deep depression will ever understand the internal pain, but on an unchosen day years from now, it will become so hard for me again that i could imagine nothing less than to die in front of someone that i've given my all for that just couldn't love me back, and people would wonder if there was any way they could've saved me and they'd battle all of these theories, when all it really was was that
*i just wanted to be worth as much as everything i gave away.*
`,
  "We Were Really Strangers": `
# “We Were Really Strangers”

The card asks “What’s one thing you’d like to say right now but are afraid to?”

“Can we skip this one?”

“Just say it!”

“I want to kiss you”

“Nnnooooooooo!“
`,
