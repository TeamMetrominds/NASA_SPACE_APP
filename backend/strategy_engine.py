import json
import os
from datetime import datetime
from config import ANALYSIS_RESULTS_DIR

class StrategyEngine:
    def __init__(self):
        self.rules_file = os.path.join(os.path.dirname(__file__), 'rules', 'planning_rules.json')
        self.rules = self._load_rules()
    
    def _load_rules(self):
        """Load planning rules from JSON file"""
        try:
            with open(self.rules_file, 'r') as f:
                data = json.load(f)
                return data.get('rules', [])
        except Exception as e:
            print(f"Error loading rules: {str(e)}")
            return []
    
    def _check_conditions(self, conditions, layer_values):
        """Check if layer values meet the rule conditions"""
        for layer, constraints in conditions.items():
            if layer not in layer_values:
                return False
            
            value = layer_values[layer].get('mean')
            if value is None:
                return False
            
            # Check minimum constraint
            if 'min' in constraints and value < constraints['min']:
                return False
            
            # Check maximum constraint
            if 'max' in constraints and value > constraints['max']:
                return False
        
        return True
    
    def get_strategies(self, analysis_results):
        """Get strategies based on analysis results"""
        if 'layers' not in analysis_results:
            return []
        
        layer_values = analysis_results['layers']
        matched_strategies = []
        
        for rule in self.rules:
            if self._check_conditions(rule['conditions'], layer_values):
                matched_strategies.append({
                    'rule_id': rule['id'],
                    'rule_name': rule['name'],
                    'priority': rule.get('priority', 999),
                    'strategies': rule['strategies'],
                    'description': rule.get('description', ''),
                    'matched_conditions': rule['conditions']
                })
        
        # Sort by priority (lower number = higher priority)
        matched_strategies.sort(key=lambda x: x['priority'])
        
        return matched_strategies
    
    def get_strategies_for_values(self, lst_value, vulnerability_value, other_values=None):
        """Get strategies for specific values (for testing or direct input)"""
        if other_values is None:
            other_values = {}
        
        layer_values = {
            'lst': {'mean': lst_value},
            'vulnerability': {'mean': vulnerability_value},
            **other_values
        }
        
        return self.get_strategies({'layers': layer_values})
    
    def save_analysis(self, analysis_results, filename=None):
        """Save analysis results to JSON file"""
        if not os.path.exists(ANALYSIS_RESULTS_DIR):
            os.makedirs(ANALYSIS_RESULTS_DIR)
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"analysis_{timestamp}.json"
        
        filepath = os.path.join(ANALYSIS_RESULTS_DIR, filename)
        
        try:
            with open(filepath, 'w') as f:
                json.dump(analysis_results, f, indent=2)
            return filepath
        except Exception as e:
            print(f"Error saving analysis: {str(e)}")
            return None
    
    def load_saved_analyses(self):
        """Load all saved analysis results"""
        if not os.path.exists(ANALYSIS_RESULTS_DIR):
            return []
        
        analyses = []
        for filename in os.listdir(ANALYSIS_RESULTS_DIR):
            if filename.endswith('.json'):
                filepath = os.path.join(ANALYSIS_RESULTS_DIR, filename)
                try:
                    with open(filepath, 'r') as f:
                        analysis = json.load(f)
                        analysis['filename'] = filename
                        analyses.append(analysis)
                except Exception as e:
                    print(f"Error loading {filename}: {str(e)}")
        
        # Sort by timestamp (newest first)
        analyses.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        return analyses
    
    def get_strategy_summary(self, analysis_results):
        """Get a summary of strategies with key metrics"""
        strategies = self.get_strategies(analysis_results)
        
        if not strategies:
            return {
                'total_strategies': 0,
                'priority_levels': [],
                'summary': 'No specific strategies identified for this area'
            }
        
        priority_levels = {}
        for strategy in strategies:
            priority = strategy['priority']
            if priority not in priority_levels:
                priority_levels[priority] = []
            priority_levels[priority].append(strategy['rule_name'])
        
        return {
            'total_strategies': len(strategies),
            'priority_levels': priority_levels,
            'summary': f"Identified {len(strategies)} strategy categories for this area",
            'strategies': strategies
        }
