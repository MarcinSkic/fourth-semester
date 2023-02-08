isMember(X,[Y|_]) :- X=Y.
isMember(X,[_|Y]) :- isMember(X,Y).

amount2([],0).
amount2([_|X],W) :- amount2(X,W1),W is W1+1.

amount3(X,W) :- amount3(0,X,W).
amount3(W,[],W) :- !.
amount3(W1,[_|X],W) :- W2 is W1+1,amount3(W2,X,W).

sum([],0).
sum([H|X],W) :- sum(X,W1),W is W1+H.

sum2(X,W) :- sum2(0,X,W).
sum2(W,[],W) :- !.
sum2(W1,[H|X],W) :- W2 is W1+H,sum2(W2,X,W).

sum3(W,[],W) :- !.
sum3(A,[H|X],W) :- A1 is A+H,sum3(A1,X,W).
