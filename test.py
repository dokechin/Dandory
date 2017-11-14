from pyschedule import Scenario, solvers, plotters
from operator import ior
S = Scenario('hello_pyschedule',horizon=10)

# Create two resources
Alice, Bob, Tom = S.Resource('Alice'), S.Resource('Bob'), S.Resource('Tom', 1000)

# Create three tasks with lengths 1,2 and 3
cook, wash, clean = S.Task('cook',1), S.Task('wash',2), S.Task('clean',3)

# Assign tasks to resources, either Alice or Bob
wash += {reduce(ior, [Alice , Bob]) , Tom}
clean += Bob
cook += Tom

# Solve and print solution
S.use_makespan_objective()
solvers.mip.solve(S,msg=1)

# Print the solution
solution = S.solution()
print solution
for t in S.tasks():
	print t.name
	print t.start_value
	print t.length
	print t.resources
