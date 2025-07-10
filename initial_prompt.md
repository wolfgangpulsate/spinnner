We are making a genAI image creation tool and want to create a fun and educational spinner.
So the user inputs a text prompt and will get an image generated according to the prompt.
We have high latency of around 20 to 40 seconds.
We do not want the user to close the dialoge or anything so we really need to keep him busy.
So I want the following.
As soon as the user submits his text prompt 
E.g: Create an image of a 35 year old female paying her coffee at a coffeeshop with her credit card.

Now as soon as the user submits the prompt with a button we do these steps:

1. First we choose and display randomly one of 100 hard coded fun text snippets -> zero latency
2. We make a fun comment in reference to the prompt, to make sure the user realized that there is some smartness/thinking happening. In our case this could be: "Hiring a female actor for the photoshoot."
3. Educate: Here we want to include a fun but educational addition that helps the user for the next prompting to create better images. BTW we create marketing in-app campaigns for a mobile banking app.
So in our case that could be: "Did you know that ads with 2 female and 1 male person attract a bigger audience?"
4. Now a fun one again: "The first candidate resigned. Hire again..."
5. Now an educational again with reference to the user prompt.
we repeat always one fun and one educational one.
Now: we use a bootstrapped frontend and ruby on rails backend.
We are here coding in cursor IDE. 
I know some react but no ruby on rails.
But my PoC code I do here should be done in a way that our dev can later easily include it to our existing repo.
We will use the openAI completions API endpoint.
I want to learn with this small project so go slow and step by step.
I have node js setup and work on windows 10, WSL but nothing is setup so far for ruby on rails.
First ask me anythign you need to know for the project.
