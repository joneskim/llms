import pandas as pd

def analyze_student_performance(data):
    df = pd.DataFrame(data)
    # Perform analysis
    summary = df.describe()
    return summary.to_dict()
